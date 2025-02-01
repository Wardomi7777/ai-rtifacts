import { useCallback } from 'react';
import { Share2, Twitter, Linkedin, Facebook } from 'lucide-react';

interface SocialMetadata {
  title: string;
  description: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
}

export const useSocialShare = (metadata: SocialMetadata) => {
  const shareUrl = window.location.href;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(metadata.title)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  };

  const handleShare = useCallback(() => {
    navigator.share?.({ title: metadata.title, url: shareUrl });
  }, [metadata.title, shareUrl]);

  return { shareLinks, handleShare };
};