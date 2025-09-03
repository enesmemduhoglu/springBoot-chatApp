import React, { useState, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ConnectionStatus } from './ConnectionStatus';
import { useWebSocket } from '../hooks/useWebSocket';

interface ChatRoomProps {
  username: string;
  onLeave: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ username, onLeave }) => {
  const { isConnected, messages, sendMessage, leaveChat, connectionError } = useWebSocket();
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    // Calculate online users from recent join/leave messages
    const recentMessages = messages.slice(-50); // Look at last 50 messages
    const userActions = new Map<string, 'join' | 'leave'>();
    
    recentMessages.forEach(msg => {
      if (msg.type === 'JOIN') {
        userActions.set(msg.sender, 'join');
      } else if (msg.type === 'LEAVE') {
        userActions.set(msg.sender, 'leave');
      }
    });

    // Count users who joined and haven't left
    let count = 0;
    userActions.forEach((action) => {
      if (action === 'join') count++;
    });
    
    setOnlineCount(Math.max(1, count)); // At least current user
  }, [messages]);

  const handleLeave = () => {
    leaveChat();
    onLeave();
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ChatHeader onlineCount={onlineCount} onLeave={handleLeave} />
      
      <MessageList messages={messages} currentUsername={username} />
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={!isConnected} 
      />
      
      <ConnectionStatus isConnected={isConnected} error={connectionError} />
    </div>
  );
};