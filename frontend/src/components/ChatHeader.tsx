import React from 'react';
import { LogOut, Users } from 'lucide-react';

interface ChatHeaderProps {
  onlineCount: number;
  onLeave: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onlineCount, onLeave }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Genel Sohbet</h1>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{onlineCount} kişi çevrimiçi</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onLeave}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        title="Sohbetten Ayrıl"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};