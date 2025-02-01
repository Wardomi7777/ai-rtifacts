import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

interface VoiceInputProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onResult,
  onError,
  className = ''
}) => {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder({
    onTranscription: onResult,
    onError
  });

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg transition-colors ${
        isRecording
          ? 'bg-red-100 text-red-600 animate-pulse'
          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
      } ${className}`}
      title={isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
      type="button"
    >
      {isRecording ? (
        <MicOff className="w-5 h-5 animate-pulse" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
};