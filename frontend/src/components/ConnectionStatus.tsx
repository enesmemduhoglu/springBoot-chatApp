import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, error }) => {
  if (isConnected) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg ${
        error ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {error ? (
          <>
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">Bağlantı kuruluyor...</span>
          </>
        )}
      </div>
    </div>
  );
};