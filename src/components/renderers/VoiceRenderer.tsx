import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { VoiceArtifact } from '../../types/artifacts';
import { AudioStorage } from '../../services/storage/AudioStorage';

interface VoiceRendererProps {
  data: VoiceArtifact;
}

export const VoiceRenderer: React.FC<VoiceRendererProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    const loadAudio = async () => {
      const blob = await AudioStorage.loadAudio(data.id);
      if (blob) {
        setAudioBlob(blob);
      }
    };
    loadAudio();
  }, [data.id]);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handlePlaybackChange = () => {
    setIsPlaying(!audioRef.current?.paused);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Audio Player */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayback}
            className="p-4 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Generated Voice</span>
            </div>
            <audio
              ref={audioRef}
              src={audioBlob ? URL.createObjectURL(audioBlob) : ''}
              onPlay={handlePlaybackChange}
              onPause={handlePlaybackChange}
              onEnded={handlePlaybackChange}
              controls
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Speech Content</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{data.content}</p>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Model</h3>
            <p className="mt-1 text-gray-600">{data.model}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Voice ID</h3>
            <p className="mt-1 text-gray-600">{data.voiceId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};