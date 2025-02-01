import React, { useState } from 'react';
import { ChatArtifact, ArtifactType } from '../../types/artifacts';
import { useArtifactStore } from '../../store/useArtifactStore';
import { LLMAPIClient } from '../../services/llm/api/client';
import { ChatInputWithOptions } from '../chat/ChatInputWithOptions';

interface ChatRendererProps {
  data: ChatArtifact;
}

export const ChatRenderer: React.FC<ChatRendererProps> = ({ data }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [editingInstructions, setEditingInstructions] = useState(false);
  const [instructions, setInstructions] = useState(data.instructions);
  const { updateArtifact } = useArtifactStore();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const llmClient = new LLMAPIClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [data.messages.length]);

  const handleSubmit = async (message: string, artifactType?: ArtifactType, templateId?: string) => {
    if (loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      content: message,
      isUser: true,
      timestamp: Date.now(),
      templateId
    };

    // Add user message
    const updatedData = {
      ...data,
      messages: [...data.messages, userMessage],
      metadata: {
        ...data.metadata,
        lastUpdated: new Date().toISOString()
      }
    };

    // Update the artifact with user message
    updateArtifact(updatedData);

    // Clear input and set loading
    setMessage('');
    setLoading(true);

    try {
      let response;
      
      if (artifactType) {
        // Generate artifact
        const { generateArtifact } = useArtifactStore.getState();
        const artifact = await generateArtifact(message, artifactType, {
          content: message,
          isUser: true,
          templateId,
          chatInstructions: data.instructions
        });
        
        response = `Generated ${artifactType}: ${artifact.title || 'Untitled'}`;
      } else {
        // Get normal chat response
        response = await llmClient.complete({
          messages: [
            ...data.messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage.content }
          ],
          chatInstructions: data.instructions
        });
      }

      // Add AI response
      const aiMessage = {
        id: crypto.randomUUID(),
        content: response,
        isUser: false,
        timestamp: Date.now()
      };

      const finalData = {
        ...updatedData,
        messages: [...updatedData.messages, aiMessage],
        metadata: {
          ...updatedData.metadata,
          lastUpdated: new Date().toISOString()
        }
      };

      // Update artifact with AI response
      updateArtifact(finalData);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // Add error message
      const errorMessage = {
        id: crypto.randomUUID(),
        content: 'Sorry, I encountered an error while processing your message.',
        isUser: false,
        timestamp: Date.now()
      };

      updateArtifact({
        ...updatedData,
        messages: [...updatedData.messages, errorMessage]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{data.title}</h2>
          {data.description && (
            <p className="mt-1 text-gray-600">{data.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
        </button>
      </header>

      {showInstructions && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Chat Instructions</h3>
            <button
              onClick={() => setEditingInstructions(!editingInstructions)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              {editingInstructions ? 'Save' : 'Edit'}
            </button>
          </div>
          {editingInstructions ? (
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              onBlur={() => {
                setEditingInstructions(false);
                updateArtifact({
                  ...data,
                  instructions
                });
              }}
              className="w-full h-32 p-3 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter instructions for how the AI should behave in this chat..."
            />
          ) : (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{instructions}</p>
          )}
        </div>
      )}

      {/* Chat Content */}
      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6 py-8">
            {data.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <ChatInputWithOptions
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};