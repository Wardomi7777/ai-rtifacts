import React from 'react';
import { Quote } from 'lucide-react';
import { Message } from '../../types/chat';
import { useArtifactStore } from '../../store/useArtifactStore';

interface QuoteButtonProps {
  message: Message;
}

export const QuoteButton: React.FC<QuoteButtonProps> = ({ message }) => {
  const { toggleQuotedMessage, quotedMessages } = useArtifactStore();
  const isQuoted = quotedMessages.has(message.id);

  const handleQuote = () => toggleQuotedMessage(message.id);

  return (
    <button
      onClick={handleQuote}
      className={`p-2 rounded-full transition-colors ${
        isQuoted
          ? 'bg-purple-500 text-white'
          : message.isUser
            ? 'text-purple-200 hover:text-white hover:bg-purple-500'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
      }`}
      title="Quote this message"
    >
      <Quote size={16} />
    </button>
  );
};