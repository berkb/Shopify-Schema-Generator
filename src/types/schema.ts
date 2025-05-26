export interface SchemaField {
  id: string;
  type: SchemaFieldType;
  label: string;
  info?: string;
  default?: any;
  placeholder?: string;
  options?: SchemaOption[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  limit?: number;
  visible_if?: string;
}

export interface SchemaOption {
  value: string;
  label: string;
  group?: string;
}

export interface SchemaBlock {
  type: string;
  name: string;
  limit?: number;
  settings: SchemaField[];
}

export interface SchemaPreset {
  name: string;
  category?: string;
  settings?: Record<string, any>;
  blocks?: Array<{
    type: string;
    name?: string;
    settings?: Record<string, any>;
  }>;
}

export interface SchemaDefault {
  name: string;
  settings?: Record<string, any>;
  blocks?: Array<{
    type: string;
    name?: string;
    settings?: Record<string, any>;
  }>;
}

export interface SchemaLocales {
  [languageCode: string]: {
    [key: string]: string;
  };
}

export interface SchemaEnabledOn {
  templates?: string[];
  groups?: string[];
}

export interface SchemaDisabledOn {
  templates?: string[];
  groups?: string[];
}

export interface Schema {
  name: string;
  tag?: string;
  class?: string;
  limit?: number;
  max_blocks?: number;
  settings: SchemaField[];
  blocks?: SchemaBlock[];
  presets?: SchemaPreset[];
  default?: SchemaDefault;
  locales?: SchemaLocales;
  enabled_on?: SchemaEnabledOn;
  disabled_on?: SchemaDisabledOn;
}

export type SchemaFieldType = 
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'range'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'color'
  | 'color_background'
  | 'image_picker'
  | 'url'
  | 'video_url'
  | 'collection'
  | 'product'
  | 'blog'
  | 'article'
  | 'page'
  | 'link_list'
  | 'file'
  | 'font_picker'
  | 'header'
  | 'paragraph';

export interface SchemaTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'ecommerce' | 'content' | 'layout' | 'advanced';
  schema: Schema;
  preview?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ExportOptions {
  format: 'json' | 'liquid';
  minify: boolean;
  includeComments: boolean;
  includePresets: boolean;
  includeBlocks: boolean;
} 