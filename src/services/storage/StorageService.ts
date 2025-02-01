import { Chat } from '../../types/chat';
import { Template } from '../../types/templates';
import { ArtifactData } from '../../types/artifacts';

const STORAGE_KEYS = {
  CHATS: 'chats',
  TEMPLATES: 'templates',
  ARTIFACTS: 'artifacts',
  KNOWLEDGE_BASES: 'knowledge_bases'
} as const;

export class StorageService {
  static saveChats(chats: Chat[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    } catch (error) {
      console.error('Failed to save chats:', error);
    }
  }

  static loadChats(): Chat[] {
    try {
      const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
      return chats ? JSON.parse(chats) : [];
    } catch (error) {
      console.error('Failed to load chats:', error);
      return [];
    }
  }

  static saveTemplates(templates: Template[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  }

  static loadTemplates(): Template[] {
    try {
      const templates = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Failed to load templates:', error);
      return [];
    }
  }

  static saveArtifacts(artifacts: ArtifactData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTIFACTS, JSON.stringify(artifacts));
    } catch (error) {
      console.error('Failed to save artifacts:', error);
    }
  }

  static loadArtifacts(): ArtifactData[] {
    try {
      const artifacts = localStorage.getItem(STORAGE_KEYS.ARTIFACTS);
      return artifacts ? JSON.parse(artifacts) : [];
    } catch (error) {
      console.error('Failed to load artifacts:', error);
      return [];
    }
  }

  static saveKnowledgeBases(knowledgeBases: KnowledgeBase[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASES, JSON.stringify(knowledgeBases));
    } catch (error) {
      console.error('Failed to save knowledge bases:', error);
    }
  }

  static loadKnowledgeBases(): KnowledgeBase[] {
    try {
      const knowledgeBases = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASES);
      return knowledgeBases ? JSON.parse(knowledgeBases) : [];
    } catch (error) {
      console.error('Failed to load knowledge bases:', error);
      return [];
    }
  }
}