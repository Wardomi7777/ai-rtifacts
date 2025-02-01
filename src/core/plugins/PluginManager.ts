import { ArtifactPlugin, PluginMetadata } from './ArtifactPlugin';
import { ArtifactFactory } from '../artifacts/ArtifactFactory';
import { ArtifactValidator } from '../artifacts/ArtifactValidator';
import { ArtifactError } from '../artifacts/ArtifactError';

export class PluginManager {
  private static instance: PluginManager;
  private plugins = new Map<string, ArtifactPlugin>();
  private pluginsByType = new Map<string, ArtifactPlugin>();
  private factory: ArtifactFactory;
  private validator: ArtifactValidator;

  private constructor() {
    this.factory = ArtifactFactory.getInstance();
    this.validator = ArtifactValidator.getInstance();
  }

  static getInstance(): PluginManager {
    if (!this.instance) {
      this.instance = new PluginManager();
    }
    return this.instance;
  }

  registerPlugin(plugin: ArtifactPlugin) {
    this.validatePlugin(plugin);
    
    // Register with factory
    this.factory.register(plugin.artifactType, () => plugin.createArtifact());
    
    // Register validation rules
    plugin.getValidationRules().forEach(rule => {
      this.validator.addRule(plugin.artifactType, rule);
    });
    
    // Store plugin
    this.plugins.set(plugin.metadata.id, plugin);
    this.pluginsByType.set(plugin.artifactType, plugin);
  }

  getPlugin(idOrType: string): ArtifactPlugin | undefined {
    // Try to find by ID first
    const pluginById = this.plugins.get(idOrType);
    if (pluginById) return pluginById;
    
    // If not found by ID, try to find by type
    return this.pluginsByType.get(idOrType);
  }

  getPluginsByType(type: string): ArtifactPlugin[] {
    return Array.from(this.plugins.values())
      .filter(plugin => plugin.artifactType === type);
  }

  getAllPlugins(): ArtifactPlugin[] {
    return Array.from(this.plugins.values());
  }

  private validatePlugin(plugin: ArtifactPlugin) {
    if (!plugin.metadata?.id) {
      throw new ArtifactError(
        'Plugin must have a valid metadata.id',
        undefined,
        'INVALID_PLUGIN_METADATA'
      );
    }

    if (this.plugins.has(plugin.metadata.id)) {
      throw new ArtifactError(
        `Plugin with id ${plugin.metadata.id} is already registered`,
        undefined,
        'DUPLICATE_PLUGIN'
      );
    }

    if (!plugin.artifactType) {
      throw new ArtifactError(
        'Plugin must specify an artifactType',
        undefined,
        'MISSING_ARTIFACT_TYPE'
      );
    }

    if (!plugin.createArtifact || !plugin.getValidationRules) {
      throw new ArtifactError(
        'Plugin must implement required methods',
        undefined,
        'MISSING_REQUIRED_METHODS'
      );
    }
  }
}