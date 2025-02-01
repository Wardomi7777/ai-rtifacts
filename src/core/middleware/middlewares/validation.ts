import { MiddlewareFunction } from '../ArtifactMiddleware';
import { ArtifactValidator } from '../../artifacts/ArtifactValidator';

export const validationMiddleware: MiddlewareFunction = async (context, next) => {
  const validator = ArtifactValidator.getInstance();
  
  // Validate data before proceeding
  if (context.data) {
    await validator.validate(context.data);
  }
  
  await next();
};