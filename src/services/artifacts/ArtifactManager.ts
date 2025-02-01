import { ArtifactData } from '../../types/artifacts';
import { StorageService } from '../storage/StorageService';
import { useChatStore } from '../../store/useChatStore';
import { AudioStorage } from '../storage/AudioStorage';
import { ArtifactError } from '../../core/artifacts/ArtifactError';
import { ArtifactMiddleware } from '../../core/middleware/ArtifactMiddleware';
import { PluginManager } from '../../core/plugins/PluginManager';
import { SpreadsheetPlugin } from '../../core/plugins/spreadsheet/SpreadsheetPlugin';
import { DocumentPlugin } from '../../core/plugins/document/DocumentPlugin';
import { DiagramPlugin } from '../../core/plugins/diagram/DiagramPlugin';
import { FormPlugin } from '../../core/plugins/form/FormPlugin';
import { SearchPlugin } from '../../core/plugins/search/SearchPlugin';
import { LayoutPlugin } from '../../core/plugins/layout/LayoutPlugin';
import { ImagePlugin } from '../../core/plugins/image/ImagePlugin';
import { VoicePlugin } from '../../core/plugins/voice/VoicePlugin';
import { MacroPlugin } from '../../core/plugins/macro/MacroPlugin';
import { CodePlugin } from '../../core/plugins/code/CodePlugin';
import { RemotePlugin } from '../../core/plugins/remote/RemotePlugin';
import { ChatPlugin } from '../../core/plugins/chat/ChatPlugin';

export class ArtifactManager {
  private static instance: ArtifactManager;
  private middleware: ArtifactMiddleware;
  private pluginManager: PluginManager;

  private constructor() {
    this.middleware = ArtifactMiddleware.getInstance();
    this.pluginManager = PluginManager.getInstance();
    
    // Register all plugins
    this.registerPlugins();
  }

  private registerPlugins() {
    const plugins = [
      new SpreadsheetPlugin(),
      new DocumentPlugin(),
      new DiagramPlugin(),
      new FormPlugin(),
      new SearchPlugin(),
      new LayoutPlugin(),
      new ImagePlugin(),
      new VoicePlugin(),
      new MacroPlugin(),
      new CodePlugin(),
      new RemotePlugin(),
      new ChatPlugin()
    ];

    plugins.forEach(plugin => {
      this.pluginManager.registerPlugin(plugin);
    });
  }

  static getInstance(): ArtifactManager {
    if (!this.instance) {
      this.instance = new ArtifactManager();
    }
    return this.instance;
  }

  async createArtifact(artifactData: ArtifactData): Promise<ArtifactData> {
    try {
      // Get plugin for artifact type
      const plugin = this.pluginManager.getPlugin(artifactData.type);
      if (!plugin) {
        throw new Error(`No plugin found for type: ${artifactData.type}`);
      }

      // Create artifact using plugin
      const artifact = plugin.createArtifact();
      Object.assign(artifact, artifactData);

      // Process through middleware
      const processedData = await this.middleware.beforeCreate(artifactData.type, artifactData);
      const result = await this.middleware.afterCreate(artifactData.type, processedData as ArtifactData);

      // Save to storage
      const artifacts = StorageService.loadArtifacts();
      artifacts.push(result);
      StorageService.saveArtifacts(artifacts);

      return result;
    } catch (error) {
      throw new ArtifactError(
        `Failed to create artifact: ${error instanceof Error ? error.message : 'Unknown error'}`,
        artifactData.type
      );
    }
  }

  async updateArtifact(artifactData: ArtifactData): Promise<ArtifactData> {
    try {
      // Get plugin for artifact type
      const plugin = this.pluginManager.getPlugin(artifactData.type);
      if (!plugin) {
        throw new Error(`No plugin found for type: ${artifactData.type}`);
      }

      // Process through middleware
      const processedData = await this.middleware.beforeCreate(artifactData.type, artifactData);
      const result = await this.middleware.afterCreate(artifactData.type, processedData as ArtifactData);

      // Update in storage
      const artifacts = StorageService.loadArtifacts();
      const index = artifacts.findIndex(a => a.id === artifactData.id);
      if (index === -1) {
        throw new Error('Artifact not found');
      }
      artifacts[index] = result;
      StorageService.saveArtifacts(artifacts);

      // Update in chat store if needed
      const { updateMessageArtifact } = useChatStore.getState();
      updateMessageArtifact(result);

      return result;
    } catch (error) {
      throw new ArtifactError(
        `Failed to update artifact: ${error instanceof Error ? error.message : 'Unknown error'}`,
        artifactData.type
      );
    }
  }

  async renameArtifact(id: string, newTitle: string): Promise<ArtifactData> {
    try {
      const artifacts = StorageService.loadArtifacts();
      const artifact = artifacts.find(a => a.id === id);
      if (!artifact) {
        throw new Error('Artifact not found');
      }

      const updated: ArtifactData = {
        ...artifact,
        title: newTitle,
        metadata: {
          ...artifact.metadata,
          lastUpdated: new Date().toISOString()
        }
      };

      return await this.updateArtifact(updated);
    } catch (error) {
      throw new ArtifactError(
        `Failed to rename artifact: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'unknown'
      );
    }
  }

  async deleteArtifact(id: string): Promise<void> {
    try {
      // Remove from storage
      const artifacts = StorageService.loadArtifacts();
      const artifact = artifacts.find(a => a.id === id);
      if (!artifact) {
        throw new Error('Artifact not found');
      }

      // Clean up associated resources
      if (artifact.type === 'voice') {
        AudioStorage.removeAudio(id);
      }

      // Remove from chat messages
      const { deleteArtifactFromMessages } = useChatStore.getState();
      deleteArtifactFromMessages(id);

      // Remove from storage
      StorageService.saveArtifacts(artifacts.filter(a => a.id !== id));
    } catch (error) {
      throw new ArtifactError(
        `Failed to delete artifact: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'unknown'
      );
    }
  }

  getArtifact(id: string): ArtifactData | null {
    const artifacts = StorageService.loadArtifacts();
    return artifacts.find(a => a.id === id) || null;
  }

  getAllArtifacts(): ArtifactData[] {
    return StorageService.loadArtifacts();
  }
}