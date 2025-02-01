import { ArtifactData, ArtifactType } from '../../types/artifacts';
import { ArtifactPlugin } from '../plugins/ArtifactPlugin';
import { PluginManager } from '../plugins/PluginManager';
import { ArtifactError } from '../artifacts/ArtifactError';

export interface MiddlewareContext {
  type: ArtifactType;
  data: Partial<ArtifactData>;
  plugin: ArtifactPlugin;
  targetType?: ArtifactType;
}

export type MiddlewareFunction = (
  context: MiddlewareContext,
  next: () => Promise<void>
) => Promise<void>;

export class ArtifactMiddleware {
  private static instance: ArtifactMiddleware;
  private middlewares: MiddlewareFunction[] = [];
  private pluginManager: PluginManager;

  private constructor() {
    this.pluginManager = PluginManager.getInstance();
  }

  static getInstance(): ArtifactMiddleware {
    if (!this.instance) {
      this.instance = new ArtifactMiddleware();
    }
    return this.instance;
  }

  use(middleware: MiddlewareFunction): void {
    this.middlewares.push(middleware);
  }

  async process(context: MiddlewareContext): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index >= this.middlewares.length) {
        return;
      }

      const middleware = this.middlewares[index++];
      await middleware(context, next);
    };

    await next();
  }

  async beforeCreate(type: ArtifactType, data: Partial<ArtifactData>): Promise<Partial<ArtifactData>> {
    const plugin = this.pluginManager.getPlugin(type);
    if (!plugin) {
      throw new ArtifactError(`No plugin found for type: ${type}`, type, 'PLUGIN_NOT_FOUND');
    }

    const context: MiddlewareContext = { type, data, plugin };
    await this.process(context);
    return context.data;
  }

  async afterCreate(type: ArtifactType, data: ArtifactData): Promise<ArtifactData> {
    const plugin = this.pluginManager.getPlugin(type);
    if (!plugin) {
      throw new ArtifactError(`No plugin found for type: ${type}`, type, 'PLUGIN_NOT_FOUND');
    }

    const context: MiddlewareContext = { type, data, plugin };
    await this.process(context);
    return context.data as ArtifactData;
  }

  async beforeTransform(
    type: ArtifactType,
    data: ArtifactData,
    targetType: ArtifactType
  ): Promise<void> {
    const plugin = this.pluginManager.getPlugin(type);
    if (!plugin) {
      throw new ArtifactError(`No plugin found for type: ${type}`, type, 'PLUGIN_NOT_FOUND');
    }

    const context: MiddlewareContext = { type, data, plugin, targetType };
    await this.process(context);
  }

  async afterTransform(
    type: ArtifactType,
    data: ArtifactData,
    targetType: ArtifactType
  ): Promise<ArtifactData> {
    const plugin = this.pluginManager.getPlugin(targetType);
    if (!plugin) {
      throw new ArtifactError(`No plugin found for type: ${targetType}`, targetType, 'PLUGIN_NOT_FOUND');
    }

    const context: MiddlewareContext = { type: targetType, data, plugin };
    await this.process(context);
    return context.data as ArtifactData;
  }
}