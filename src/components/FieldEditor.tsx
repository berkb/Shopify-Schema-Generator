'use client';

import { useSchemaStore } from '@/store/schemaStore';
import { SchemaFieldType } from '@/types/schema';

export function FieldEditor() {
  const { schema, selectedField, updateField, setSelectedField } = useSchemaStore();
  
  const field = schema.settings.find(f => f.id === selectedField);
  
  if (!field) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p>Select a field to edit</p>
        </div>
      </div>
    );
  }

  const handleUpdateField = (updates: Partial<typeof field>) => {
    updateField(field.id, updates);
    
    // If field ID is being updated, update the selectedField state to track the new ID
    if (updates.id && selectedField === field.id) {
      setSelectedField(updates.id);
    }
  };

  const fieldTypes: { value: SchemaFieldType; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'richtext', label: 'Rich Text' },
    { value: 'number', label: 'Number' },
    { value: 'range', label: 'Range' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'select', label: 'Select' },
    { value: 'color', label: 'Color' },
    { value: 'color_background', label: 'Color Background' },
    { value: 'image_picker', label: 'Image Picker' },
    { value: 'url', label: 'URL' },
    { value: 'video_url', label: 'Video URL' },
    { value: 'collection', label: 'Collection' },
    { value: 'product', label: 'Product' },
    { value: 'blog', label: 'Blog' },
    { value: 'article', label: 'Article' },
    { value: 'page', label: 'Page' },
    { value: 'link_list', label: 'Link List' },
    { value: 'file', label: 'File' },
    { value: 'font_picker', label: 'Font Picker' },
    { value: 'header', label: 'Header' },
    { value: 'paragraph', label: 'Paragraph' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Edit Field</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Field ID</label>
          <input
            type="text"
            value={field.id}
            onChange={(e) => handleUpdateField({ id: e.target.value })}
            className="input-field"
            placeholder="field_id"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleUpdateField({ label: e.target.value })}
            className="input-field"
            placeholder="Field Label"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={field.type}
            onChange={(e) => handleUpdateField({ type: e.target.value as SchemaFieldType })}
            className="input-field"
          >
            {fieldTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Info Text</label>
          <textarea
            value={field.info || ''}
            onChange={(e) => handleUpdateField({ info: e.target.value })}
            className="input-field"
            placeholder="Help text for this field"
            rows={2}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Default Value</label>
          <input
            type="text"
            value={field.default || ''}
            onChange={(e) => handleUpdateField({ default: e.target.value })}
            className="input-field"
            placeholder="Default value"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Placeholder</label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => handleUpdateField({ placeholder: e.target.value })}
            className="input-field"
            placeholder="Placeholder text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Visible If (Conditional)</label>
          <textarea
            value={field.visible_if || ''}
            onChange={(e) => handleUpdateField({ visible_if: e.target.value })}
            className="input-field"
            placeholder='{{ settings.layout_style == "flex" }}'
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Liquid expression to conditionally show this field. 
            <a 
              href="https://shopify.dev/docs/storefronts/themes/architecture/settings#conditional-settings" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline ml-1"
            >
              Learn more
            </a>
          </p>
        </div>

        {/* Range specific fields */}
        {field.type === 'range' && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Min</label>
                <input
                  type="number"
                  value={field.min || ''}
                  onChange={(e) => handleUpdateField({ min: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max</label>
                <input
                  type="number"
                  value={field.max || ''}
                  onChange={(e) => handleUpdateField({ max: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Step</label>
                <input
                  type="number"
                  value={field.step || ''}
                  onChange={(e) => handleUpdateField({ step: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
          </>
        )}

        {/* Select/Radio options */}
        {(['select', 'radio'].includes(field.type)) && (
          <div>
            <label className="block text-sm font-medium mb-2">Options</label>
            <div className="space-y-2">
              {(field.options || []).map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = { ...option, value: e.target.value };
                      handleUpdateField({ options: newOptions });
                    }}
                    className="input-field flex-1"
                    placeholder="Value"
                  />
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = { ...option, label: e.target.value };
                      handleUpdateField({ options: newOptions });
                    }}
                    className="input-field flex-1"
                    placeholder="Label"
                  />
                  <button
                    onClick={() => {
                      const newOptions = [...(field.options || [])];
                      newOptions.splice(index, 1);
                      handleUpdateField({ options: newOptions });
                    }}
                    className="btn-secondary px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(field.options || []), { value: '', label: '' }];
                  handleUpdateField({ options: newOptions });
                }}
                className="btn-secondary w-full"
              >
                Add Option
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 