import React from 'react';
import { MessageCircle, FileText, Table, GitBranch, Search, Image, Mic, Play, Pause, Volume2, Globe } from 'lucide-react';
import { Message } from '../../types/chat';
import { QuoteButton } from './QuoteButton';
import { TransformButton } from './TransformButton';
import { ReferenceTag, ReferenceType } from './ReferenceTag';
import { useNavigate } from '../../hooks/useNavigate';
import { useTemplateStore } from '../../store/useTemplateStore';

const icons = {
  ask: MessageCircle,
  document: FileText,
  spreadsheet: Table,
  diagram: GitBranch,
  search: Search,
  image: Image,
  voice: Mic,
  remote: Globe,
};

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { navigateToArtifact } = useNavigate();
  const { templates } = useTemplateStore();
  const Icon = message.artifactData ? icons[message.artifactData.type] : null;
  
  // Get template reference if message has one
  const templateReference = message.isUser && message.templateId ? {
    type: 'template' as ReferenceType,
    title: templates.find(t => t.id === message.templateId)?.name || 'Template',
    artifactType: message.artifactData?.type
  } : undefined;
  
  // Combine all references
  const allReferences = [
    ...(message.references || []),
    ...(templateReference ? [templateReference] : [])
  ];

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[80%] rounded-2xl px-6 py-4 group z-10 ${
          message.isUser
            ? 'bg-purple-600 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        {message.imageUrl && (
          <div className="mb-4">
            <img 
              src={message.imageUrl} 
              alt="Uploaded content"
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        )}
        <div className={`absolute top-2 ${message.isUser ? 'left-0' : 'right-0'} transform ${
          message.isUser ? '-translate-x-full' : 'translate-x-full'
        } opacity-0 group-hover:opacity-100 transition-opacity px-2 z-20`}>
          <QuoteButton message={message} />
          {!message.isUser && <TransformButton message={message} />}
        </div>
        
        <div 
          className={`whitespace-pre-wrap ${
            message.isUser ? 'text-white' : 'text-gray-900'
          }`}>
          {message.content?.split(/\*\*(.*?)\*\*/g).map((part, i) => 
            i % 2 === 0 ? part : <strong key={i}>{part}</strong>
          )}
          {allReferences.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {allReferences.map((ref, index) => (
                <ReferenceTag
                  key={index}
                  type={ref.type}
                  title={ref.title}
                  artifactType={ref.artifactType}
                />
              ))}
            </div>
          )}
        </div>
        
        {message.artifactData && (
          <>
              {message.artifactData.type === 'image' ? (
                <div className="mt-4">
                  <img 
                    src={message.artifactData.imageUrl} 
                    alt={message.artifactData.prompt}
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                  <button
                    onClick={() => navigateToArtifact(message.artifactData)}
                    className={`mt-2 flex items-center gap-2 text-sm ${
                      message.isUser
                        ? 'text-purple-200 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    } transition-colors`}
                  >
                    <Image size={16} />
                    <span>View details</span>
                  </button>
                </div>
              ) : message.artifactData.type === 'voice' ? (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const audio = e.currentTarget.parentElement?.querySelector('audio');
                        if (audio) {
                          audio.paused ? audio.play() : audio.pause();
                        }
                      }}
                      className="p-3 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                    >
                      <Play size={20} className="play-icon" />
                      <Pause size={20} className="pause-icon hidden" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Voice Message</span>
                      </div>
                      <audio
                        src={message.artifactData.audioUrl}
                        className="w-full"
                        onPlay={(e) => {
                          const button = e.currentTarget.parentElement?.parentElement?.querySelector('button');
                          if (button) {
                            button.querySelector('.play-icon')?.classList.add('hidden');
                            button.querySelector('.pause-icon')?.classList.remove('hidden');
                          }
                        }}
                        onPause={(e) => {
                          const button = e.currentTarget.parentElement?.parentElement?.querySelector('button');
                          if (button) {
                            button.querySelector('.play-icon')?.classList.remove('hidden');
                            button.querySelector('.pause-icon')?.classList.add('hidden');
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => navigateToArtifact(message.artifactData)}
                    className={`mt-2 flex items-center gap-2 text-sm ${
                      message.isUser
                        ? 'text-purple-200 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    } transition-colors`}
                  >
                    <Mic size={16} />
                    <span>View details</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateToArtifact(message.artifactData)}
                  className={`mt-4 flex items-center gap-2 text-sm ${
                    message.isUser
                      ? 'text-purple-200 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {Icon && <Icon size={16} />}
                  <span>View {message.artifactData.type}</span>
                </button>
              )}
          </>
        )}
      </div>
    </div>
  );
};