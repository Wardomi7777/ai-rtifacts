import { ArtifactType, ArtifactData } from '../../types/artifacts';
import { ArtifactGenerator } from './generators/base';
import { AskGenerator } from './generators/ask';
import { DocumentGenerator } from './generators/document';
import { SpreadsheetGenerator } from './generators/spreadsheet';
import { DiagramGenerator } from './generators/diagram';
import { FormGenerator } from './generators/form';
import { SearchGenerator } from './generators/search';
import { LayoutGenerator } from './generators/layout';
import { ImageGenerator } from './generators/image';
import { VoiceGenerator } from './generators/voice';
import { ThinkGenerator } from './generators/think';
import { MacroGenerator } from './generators/macro';
import { CodeGenerator } from './generators/code';
import { RemoteGenerator } from './generators/remote';
import { ChatGenerator } from './generators/chat';

export class GeneratorRegistry {
  private static instance: GeneratorRegistry;
  private generators = new Map<ArtifactType, ArtifactGenerator<any>>();

  private constructor() {
    // Register default generators
    this.register(new AskGenerator());
    this.register(new ThinkGenerator());
    this.register(new DocumentGenerator());
    this.register(new SpreadsheetGenerator());
    this.register(new DiagramGenerator());
    this.register(new FormGenerator());
    this.register(new SearchGenerator());
    this.register(new LayoutGenerator());
    this.register(new ImageGenerator());
    this.register(new VoiceGenerator());
    this.register(new MacroGenerator());
    this.register(new CodeGenerator());
    this.register(new RemoteGenerator());
    this.register(new ChatGenerator());
  }

  static getInstance(): GeneratorRegistry {
    if (!this.instance) {
      this.instance = new GeneratorRegistry();
    }
    return this.instance;
  }

  register<T extends ArtifactData>(generator: ArtifactGenerator<T>) {
    this.generators.set(generator.type, generator);
  }

  get<T extends ArtifactData>(type: ArtifactType): ArtifactGenerator<T> {
    const generator = this.generators.get(type);
    if (!generator) {
      throw new Error(`No generator registered for type: ${type}`);
    }
    return generator as ArtifactGenerator<T>;
  }
}