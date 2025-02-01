import React from 'react';
import { MessageSquare, X, Maximize2, Minimize2 } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useUIStore } from '../../store/useUIStore';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';

export const ChatDrawer: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = React.useState(true);
  const { currentChatId, isChatOpen, setChatOpen } = useChatStore((state) => ({
    currentChatId: state.currentChatId,
    isChatOpen: state.isChatOpen,
    setChatOpen: state.setChatOpen
  }));
  
  // Update overlay state when drawer opens/closes
  React.useEffect(() => {
    useUIStore.getState().setIsAnyOverlayOpen(isChatOpen);
  }, [isChatOpen]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all ${
          isChatOpen ? 'bg-gray-700 text-white' : 'bg-purple-600 text-white'
        } ${isFullScreen ? 'translate-y-[200%]' : ''}`}
      >
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat Drawer */}
      <div
        data-chat-drawer
        className={`fixed inset-y-0 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isChatOpen
            ? 'translate-x-0' 
            : 'translate-x-full'
        } ${
          isFullScreen
            ? 'inset-x-0 z-50'
            : 'right-0 w-96'
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullScreen}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Content */}

          <ChatHistory />
          <ChatInput />
        </div>
      </div>
    </>
  );
};