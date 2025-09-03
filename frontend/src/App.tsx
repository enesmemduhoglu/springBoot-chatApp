import React, { useState } from 'react';
import { UsernameModal } from './components/UsernameModal';
import { ChatRoom } from './components/ChatRoom';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [isInChat, setIsInChat] = useState(false);
  const { joinChat, isConnected } = useWebSocket();

  const handleJoinChat = (username: string) => {
    setCurrentUsername(username);
    setIsInChat(true);
    joinChat(username);
  };

  const handleLeaveChat = () => {
    setCurrentUsername('');
    setIsInChat(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isInChat ? (
        <UsernameModal 
          onJoin={handleJoinChat} 
          isConnecting={!isConnected && currentUsername !== ''} 
        />
      ) : (
        <ChatRoom 
          username={currentUsername} 
          onLeave={handleLeaveChat} 
        />
      )}
    </div>
  );
}

export default App;