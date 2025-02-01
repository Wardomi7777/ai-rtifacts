import { MiddlewareFunction } from '../ArtifactMiddleware';

export const loggingMiddleware: MiddlewareFunction = async (context, next) => {
  const startTime = Date.now();
  
  try {
    console.log(`[${context.type}] Processing started`);
    await next();
    console.log(`[${context.type}] Processing completed in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error(`[${context.type}] Error:`, error);
    throw error;
  }
};