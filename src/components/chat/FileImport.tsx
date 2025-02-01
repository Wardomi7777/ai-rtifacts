import React, { useRef, useState } from 'react';
import { FileUp, Loader } from 'lucide-react';
import { useFileProcessor } from '../../hooks/useFileProcessor';

interface FileImportProps {
  onFileProcessed: (content: string) => void;
}

export const FileImport: React.FC<FileImportProps> = ({ onFileProcessed }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { processFile, loading, error } = useFileProcessor();
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    try {
      const content = await processFile(file);
      onFileProcessed(content);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to process file:', err);
    }
  };

  const acceptedTypes = [
    '.txt', '.md', '.pdf', '.doc', '.docx',
    '.xls', '.xlsx', '.csv',
    '.json', '.xml'
  ].join(',');

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Import file"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <FileUp className="w-5 h-5" />
        )}
      </button>
      
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-50 text-red-600 text-sm rounded-lg whitespace-nowrap">
          {error}
        </div>
      )}
      
      {fileName && !error && !loading && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-green-50 text-green-600 text-sm rounded-lg whitespace-nowrap">
          Imported: {fileName}
        </div>
      )}
    </div>
  );
};