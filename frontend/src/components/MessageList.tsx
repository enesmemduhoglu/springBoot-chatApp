import React, { useEffect, useRef } from 'react';
import { ChatMessage, MessageType } from '../types/chat';
import { MessageBubble } from './MessageBubble';
import { SystemMessage } from './SystemMessage';
import { MessageCircle } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  currentUsername: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUsername }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sohbete Hoş Geldiniz!</h3>
          <p className="text-gray-600">Henüz mesaj yok. İlk mesajı siz gönderin!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
      {messages.map((message, index) => {
        const isSystemMessage = message.type === MessageType.JOIN || message.type === MessageType.LEAVE;
        const isOwnMessage = message.sender === currentUsername && message.type === MessageType.CHAT;
        
        return (
          <div key={index} className="animate-fade-in">
            {isSystemMessage ? (
              <SystemMessage message={message} />
            ) : (
              <MessageBubble 
                message={message} 
                isOwnMessage={isOwnMessage}
              />
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};