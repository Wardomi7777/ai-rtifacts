export interface KnowledgeBase {
  id: string;
  name: string;
  color: string;
  artifactIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type KnowledgeBaseColor = 
  | 'blue' 
  | 'purple' 
  | 'green' 
  | 'yellow' 
  | 'red' 
  | 'pink' 
  | 'indigo' 
  | 'cyan';