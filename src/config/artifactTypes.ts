import { MessageCircle, Brain, FileText, Table, GitBranch, FormInput, Search, Layout, Image, Mic, ListTodo, Code, Globe, MessageSquareMore } from 'lucide-react';
import { ArtifactType } from '../types/artifacts';

export const typeConfig = {
  ask: {
    icon: MessageCircle,
    label: 'Ask',
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    hover: 'hover:bg-blue-50'
  },
  think: {
    icon: Brain,
    label: 'Think',
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    hover: 'hover:bg-purple-50'
  },
  document: {
    icon: FileText,
    label: 'Document',
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
    hover: 'hover:bg-emerald-50'
  },
  spreadsheet: {
    icon: Table,
    label: 'Spreadsheet',
    color: 'text-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    hover: 'hover:bg-orange-50'
  },
  diagram: {
    icon: GitBranch,
    label: 'Diagram',
    color: 'text-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
    hover: 'hover:bg-indigo-50'
  },
  form: {
    icon: FormInput,
    label: 'Form',
    color: 'text-rose-500',
    gradient: 'from-rose-500 to-rose-600',
    hover: 'hover:bg-rose-50'
  },
  search: {
    icon: Search,
    label: 'Search',
    color: 'text-sky-500',
    gradient: 'from-sky-500 to-sky-600',
    hover: 'hover:bg-sky-50'
  },
  layout: {
    icon: Layout,
    label: 'Layout',
    color: 'text-violet-500',
    gradient: 'from-violet-500 to-violet-600',
    hover: 'hover:bg-violet-50'
  },
  image: {
    icon: Image,
    label: 'Image',
    color: 'text-rose-500',
    gradient: 'from-rose-500 to-rose-600',
    hover: 'hover:bg-rose-50'
  },
  voice: {
    icon: Mic,
    label: 'Voice',
    color: 'text-cyan-500',
    gradient: 'from-cyan-500 to-cyan-600',
    hover: 'hover:bg-cyan-50'
  },
  macro: {
    icon: ListTodo,
    label: 'Macro',
    color: 'text-rose-500',
    gradient: 'from-rose-500 to-rose-600',
    hover: 'hover:bg-rose-50'
  },
  code: {
    icon: Code,
    label: 'Code',
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
    hover: 'hover:bg-emerald-50'
  },
  remote: {
    icon: Globe,
    label: 'Remote Action',
    color: 'text-cyan-500',
    gradient: 'from-cyan-500 to-cyan-600',
    hover: 'hover:bg-cyan-50'
  },
  chat: {
    icon: MessageSquareMore,
    label: 'Chat',
    color: 'text-teal-500',
    gradient: 'from-teal-500 to-emerald-600',
    hover: 'hover:bg-teal-50'
  }
} as const;

export const artifactTypes: ArtifactType[] = [
  'ask',
  'think',
  'document',
  'spreadsheet',
  'diagram',
  'form',
  'search',
  'layout',
  'image',
  'voice',
  'macro',
  'code',
  'remote',
  'chat'
];