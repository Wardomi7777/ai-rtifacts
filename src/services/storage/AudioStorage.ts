import { VoiceArtifact } from '../../types/artifacts';

export class AudioStorage {
  private static STORAGE_PREFIX = 'audio_';

  static async saveAudio(artifactId: string, audioBlob: Blob): Promise<string> {
    try {
      // Convert blob to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });

      // Store in localStorage with prefix
      const key = this.STORAGE_PREFIX + artifactId;
      localStorage.setItem(key, base64);
      
      return key;
    } catch (error) {
      console.error('Failed to save audio:', error);
      throw error;
    }
  }

  static async loadAudio(artifactId: string): Promise<Blob | null> {
    try {
      const key = this.STORAGE_PREFIX + artifactId;
      const base64 = localStorage.getItem(key);
      
      if (!base64) return null;

      // Convert base64 back to blob
      const response = await fetch(base64);
      return await response.blob();
    } catch (error) {
      console.error('Failed to load audio:', error);
      return null;
    }
  }

  static removeAudio(artifactId: string): void {
    try {
      const key = this.STORAGE_PREFIX + artifactId;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove audio:', error);
    }
  }

  // Clean up orphaned audio files
  static cleanupOrphanedAudio(activeArtifactIds: string[]): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.STORAGE_PREFIX)
      );

      keys.forEach(key => {
        const artifactId = key.replace(this.STORAGE_PREFIX, '');
        if (!activeArtifactIds.includes(artifactId)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to cleanup orphaned audio:', error);
    }
  }
}