import { create } from 'zustand';
import { Schema, SchemaField, SchemaBlock, SchemaPreset, ValidationError, ExportOptions } from '@/types/schema';

interface SchemaStore {
  // State
  schema: Schema;
  selectedField: string | null;
  validationErrors: ValidationError[];
  isDarkMode: boolean;
  exportOptions: ExportOptions;
  
  // Actions
  updateSchema: (updates: Partial<Schema>) => void;
  addField: (field: SchemaField) => void;
  updateField: (fieldId: string, updates: Partial<SchemaField>) => void;
  removeField: (fieldId: string) => void;
  reorderFields: (oldIndex: number, newIndex: number) => void;
  
  addBlock: (block: SchemaBlock) => void;
  updateBlock: (blockType: string, updates: Partial<SchemaBlock>) => void;
  removeBlock: (blockType: string) => void;
  
  addPreset: (preset: SchemaPreset) => void;
  updatePreset: (index: number, preset: SchemaPreset) => void;
  removePreset: (index: number) => void;
  
  setSelectedField: (fieldId: string | null) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  toggleDarkMode: () => void;
  setExportOptions: (options: Partial<ExportOptions>) => void;
  
  resetSchema: () => void;
  loadSchema: (schema: Schema) => void;
  reorderBlockFields: (blockType: string, oldIndex: number, newIndex: number) => void;
}

const defaultSchema: Schema = {
  name: 'Custom Section',
  tag: 'section',
  settings: [],
  blocks: [],
  presets: [{
    name: 'Default',
    category: 'Custom'
  }]
};

const defaultExportOptions: ExportOptions = {
  format: 'json',
  minify: false,
  includeComments: true,
  includePresets: true,
  includeBlocks: true
};

export const useSchemaStore = create<SchemaStore>((set, get) => ({
  // Initial state
  schema: defaultSchema,
  selectedField: null,
  validationErrors: [],
  isDarkMode: false,
  exportOptions: defaultExportOptions,
  
  // Actions
  updateSchema: (updates) => set((state) => ({
    schema: { ...state.schema, ...updates }
  })),
  
  addField: (field) => set((state) => ({
    schema: {
      ...state.schema,
      settings: [...state.schema.settings, field]
    }
  })),
  
  updateField: (fieldId, updates) => set((state) => {
    const updatedSettings = state.schema.settings.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    
    // If field ID is being updated, update selectedField to track the new ID
    const newSelectedField = updates.id && state.selectedField === fieldId 
      ? updates.id 
      : state.selectedField;
    
    return {
      schema: {
        ...state.schema,
        settings: updatedSettings
      },
      selectedField: newSelectedField
    };
  }),
  
  removeField: (fieldId) => set((state) => ({
    schema: {
      ...state.schema,
      settings: state.schema.settings.filter(field => field.id !== fieldId)
    },
    selectedField: state.selectedField === fieldId ? null : state.selectedField
  })),
  
  reorderFields: (oldIndex, newIndex) => set((state) => {
    const newSettings = [...state.schema.settings];
    const [removed] = newSettings.splice(oldIndex, 1);
    newSettings.splice(newIndex, 0, removed);
    
    return {
      schema: {
        ...state.schema,
        settings: newSettings
      }
    };
  }),
  
  addBlock: (block) => set((state) => ({
    schema: {
      ...state.schema,
      blocks: [...(state.schema.blocks || []), block]
    }
  })),
  
  updateBlock: (blockType, updates) => set((state) => ({
    schema: {
      ...state.schema,
      blocks: (state.schema.blocks || []).map(block =>
        block.type === blockType ? { ...block, ...updates } : block
      )
    }
  })),
  
  removeBlock: (blockType) => set((state) => ({
    schema: {
      ...state.schema,
      blocks: (state.schema.blocks || []).filter(block => block.type !== blockType)
    }
  })),
  
  addPreset: (preset) => set((state) => ({
    schema: {
      ...state.schema,
      presets: [...(state.schema.presets || []), preset]
    }
  })),
  
  updatePreset: (index, preset) => set((state) => ({
    schema: {
      ...state.schema,
      presets: (state.schema.presets || []).map((p, i) => i === index ? preset : p)
    }
  })),
  
  removePreset: (index) => set((state) => ({
    schema: {
      ...state.schema,
      presets: (state.schema.presets || []).filter((_, i) => i !== index)
    }
  })),
  
  setSelectedField: (fieldId) => set({ selectedField: fieldId }),
  
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  setExportOptions: (options) => set((state) => ({
    exportOptions: { ...state.exportOptions, ...options }
  })),
  
  resetSchema: () => set({
    schema: defaultSchema,
    selectedField: null,
    validationErrors: []
  }),
  
  loadSchema: (schema) => set({
    schema,
    selectedField: null,
    validationErrors: []
  }),
  
  reorderBlockFields: (blockType, oldIndex, newIndex) => set((state) => {
    const updatedBlocks = (state.schema.blocks || []).map(block => {
      if (block.type === blockType) {
        const newSettings = [...block.settings];
        const [removed] = newSettings.splice(oldIndex, 1);
        newSettings.splice(newIndex, 0, removed);
        return { ...block, settings: newSettings };
      }
      return block;
    });
    
    return {
      schema: {
        ...state.schema,
        blocks: updatedBlocks
      }
    };
  })
})); 