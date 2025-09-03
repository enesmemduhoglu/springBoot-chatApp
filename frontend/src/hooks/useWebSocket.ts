import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage, MessageType } from '../types/chat';

interface UseWebSocketReturn {
  isConnected: boolean;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  joinChat: (username: string) => void;
  leaveChat: () => void;
  connectionError: string | null;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>('');
  
  const stompClientRef = useRef<Client | null>(null);

  const connect = useCallback((username: string) => {
    try {
      const socket = new SockJS('http://localhost:8080/ws');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.onConnect = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        setConnectionError(null);
        
        // Subscribe to public messages
        stompClient.subscribe('/topic/public', (message) => {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          chatMessage.timestamp = Date.now();
          setMessages(prev => [...prev, chatMessage]);
        });

        // Send join message
        stompClient.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            sender: username,
            type: MessageType.JOIN
          })
        });
      };

      stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        setConnectionError('Bağlantı hatası oluştu');
        setIsConnected(false);
      };

      stompClient.onWebSocketClose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
      };

      stompClient.activate();
      stompClientRef.current = stompClient;
      setCurrentUsername(username);
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError('Sunucuya bağlanılamadı');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (stompClientRef.current && isConnected) {
      // Send leave message before disconnecting
      stompClientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          sender: currentUsername,
          type: MessageType.LEAVE
        })
      });
      
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
      setMessages([]);
      setCurrentUsername('');
    }
  }, [isConnected, currentUsername]);

  const sendMessage = useCallback((content: string) => {
    if (stompClientRef.current && isConnected && content.trim()) {
      stompClientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          content: content.trim(),
          sender: currentUsername,
          type: MessageType.CHAT
        })
      });
    }
  }, [isConnected, currentUsername]);

  const joinChat = useCallback((username: string) => {
    connect(username);
  }, [connect]);

  const leaveChat = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    messages,
    sendMessage,
    joinChat,
    leaveChat,
    connectionError
  };
};