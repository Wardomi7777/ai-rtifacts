import React from 'react';
import { useChatStore } from '../../store/useChatStore';
import { ChatMessage } from './ChatMessage';

export const ChatHistory: React.FC = () => {
  const { chats, currentChatId } = useChatStore();
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-40">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};