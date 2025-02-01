import { useState, useCallback } from 'react';
import { WhisperClient } from '../services/llm/api/whisper';

interface UseVoiceRecorderProps {
  onTranscription: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceRecorder = ({ onTranscription, onError }: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const whisperClient = new WhisperClient();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        try {
          const transcription = await whisperClient.transcribe(audioBlob);
          onTranscription(transcription);
        } catch (err) {
          onError?.(err instanceof Error ? err.message : 'Transcription failed');
        } finally {
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to start recording');
      setIsRecording(false);
    }
  }, [onTranscription, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  }, [mediaRecorder, isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};