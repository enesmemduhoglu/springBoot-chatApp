export interface ChatMessage {
  content: string;
  sender: string;
  type: MessageType;
  timestamp?: number;
}

export enum MessageType {
  CHAT = 'CHAT',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE'
}

export interface User {
  username: string;
  isOnline: boolean;
}