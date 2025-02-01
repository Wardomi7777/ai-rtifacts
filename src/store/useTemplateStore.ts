import { create } from 'zustand';
import { Template } from '../types/templates';
import { StorageService } from '../services/storage/StorageService';

interface TemplateStore {
  templates: Template[];
  showTemplateManager: boolean;
  selectedTemplate: Template | null;
  setTemplates: (templates: Template[]) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  setShowTemplateManager: (show: boolean) => void;
  setSelectedTemplate: (template: Template | null) => void;
}

// Load initial templates from storage
const initialTemplates = StorageService.loadTemplates();

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: initialTemplates,
  showTemplateManager: false,
  selectedTemplate: null,
  setTemplates: (templates) => {
    StorageService.saveTemplates(templates);
    set({ templates });
  },
  addTemplate: (template) => set((state) => {
    const newTemplates = [...state.templates, template];
    StorageService.saveTemplates(newTemplates);
    return { templates: newTemplates };
  }),
  updateTemplate: (template) => set((state) => {
    const newTemplates = state.templates.map((t) =>
      t.id === template.id ? template : t
    );
    StorageService.saveTemplates(newTemplates);
    return { templates: newTemplates };
  }),
  deleteTemplate: (id) => set((state) => {
    const newTemplates = state.templates.filter((t) => t.id !== id);
    StorageService.saveTemplates(newTemplates);
    return { templates: newTemplates };
  }),
  setShowTemplateManager: (show) => set({ showTemplateManager: show }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
}));