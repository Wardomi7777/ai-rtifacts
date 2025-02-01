import { MiddlewareFunction } from '../ArtifactMiddleware';

export const metadataMiddleware: MiddlewareFunction = async (context, next) => {
  // Add or update metadata before processing
  if (context.data) {
    context.data.metadata = {
      ...context.data.metadata,
      lastUpdated: new Date().toISOString()
    };
  }
  
  await next();
  
  // Update metadata after processing
  if (context.data) {
    context.data.metadata = {
      ...context.data.metadata,
      lastUpdated: new Date().toISOString()
    };
  }
};