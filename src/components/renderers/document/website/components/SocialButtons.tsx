import React from 'react';
import { Share2, Twitter, Linkedin, Facebook } from 'lucide-react';

interface SocialButtonsProps {
  shareLinks: {
    twitter: string;
    linkedin: string;
    facebook: string;
  };
  onShare: () => void;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({ shareLinks, onShare }) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onShare}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Share2 className="w-5 h-5" />
      </button>
      {Object.entries(shareLinks).map(([platform, url]) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {platform === 'twitter' && <Twitter className="w-5 h-5" />}
          {platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
          {platform === 'facebook' && <Facebook className="w-5 h-5" />}
        </a>
      ))}
    </div>
  );
};