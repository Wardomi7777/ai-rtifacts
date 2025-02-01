import React, { useRef } from 'react';
import { ImagePlus, Loader } from 'lucide-react';
import { useImageAnalysis } from '../../hooks/useImageAnalysis';
import { useArtifactStore } from '../../store/useArtifactStore';

interface ImageUploadProps {
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeImage, loading, error } = useImageAnalysis();
  const { setImageData } = useArtifactStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      setImageData({ file, url: imageUrl });
      const description = await analyzeImage(file);
      setImageData({ file, url: imageUrl, description });
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to analyze image:', err);
      setImageData(null);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Upload and analyze image"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <ImagePlus className="w-5 h-5" />
        )}
      </button>
      
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-50 text-red-600 text-sm rounded-lg whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};