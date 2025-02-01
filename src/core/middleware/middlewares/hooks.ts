import { MiddlewareFunction } from '../ArtifactMiddleware';

export const pluginHooksMiddleware: MiddlewareFunction = async (context, next) => {
  const { plugin, data, targetType } = context;
  
  // Call plugin hooks based on operation type
  if (targetType) {
    // Transform operation
    if (plugin.beforeTransform) {
      await plugin.beforeTransform(data, targetType);
    }
  } else {
    // Create operation
    if (plugin.beforeCreate) {
      context.data = await plugin.beforeCreate(data);
    }
  }
  
  await next();
  
  // Post-processing hooks
  if (targetType) {
    if (plugin.afterTransform) {
      context.data = await plugin.afterTransform(data);
    }
  } else {
    if (plugin.afterCreate) {
      await plugin.afterCreate(data);
    }
  }
};