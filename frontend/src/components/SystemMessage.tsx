import React from 'react';
import { ChatMessage, MessageType } from '../types/chat';
import { UserPlus, UserMinus } from 'lucide-react';

interface SystemMessageProps {
  message: ChatMessage;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({ message }) => {
  const isJoin = message.type === MessageType.JOIN;
  
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
        {isJoin ? (
          <UserPlus className="w-4 h-4 text-green-600" />
        ) : (
          <UserMinus className="w-4 h-4 text-red-600" />
        )}
        <span>
          <strong>{message.sender}</strong> sohbete {isJoin ? 'katıldı' : 'ayrıldı'}
        </span>
      </div>
    </div>
  );
};