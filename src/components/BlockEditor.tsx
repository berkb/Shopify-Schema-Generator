'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit3, Settings, GripVertical, X, Check } from 'lucide-react';
import { useSchemaStore } from '@/store/schemaStore';
import { SchemaBlock, SchemaField, SchemaFieldType } from '@/types/schema';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockFieldItemProps {
  field: SchemaField;
  blockType: string;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableBlockFieldItem({ field, blockType, onEdit, onDelete }: SortableBlockFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{field.label}</span>
            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              {field.type}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">ID: {field.id}</p>
          {field.info && (
            <p className="text-xs text-gray-400 mt-1">Info: {field.info}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="btn-icon text-sm"
          title="Edit field"
        >
          <Settings className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="btn-icon text-red-600 hover:text-red-700 text-sm"
          title="Delete field"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export function BlockEditor() {
  const { schema, addBlock, updateBlock, removeBlock, reorderBlockFields } = useSchemaStore();
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ blockType: string; fieldId: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFieldForm, setShowFieldForm] = useState<string | null>(null);
  const [newBlock, setNewBlock] = useState<Partial<SchemaBlock>>({
    type: '',
    name: '',
    settings: []
  });
  const [newField, setNewField] = useState<Partial<SchemaField>>({
    id: '',
    type: 'text',
    label: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleAddBlock = () => {
    if (newBlock.type && newBlock.name) {
      const block: SchemaBlock = {
        type: newBlock.type,
        name: newBlock.name,
        limit: newBlock.limit,
        settings: []
      };
      addBlock(block);
      setNewBlock({ type: '', name: '', settings: [] });
      setShowAddForm(false);
    }
  };

  const handleUpdateBlock = (blockType: string, updates: Partial<SchemaBlock>) => {
    updateBlock(blockType, updates);
  };

  const handleAddFieldToBlock = (blockType: string) => {
    if (newField.id && newField.label && newField.type) {
      const field: SchemaField = {
        id: newField.id,
        type: newField.type,
        label: newField.label,
        info: newField.info,
        default: newField.default,
        placeholder: newField.placeholder,
        min: newField.min,
        max: newField.max,
        step: newField.step,
        options: newField.options,
        accept: newField.accept,
        limit: newField.limit,
        visible_if: newField.visible_if
      };
      
      const block = schema.blocks?.find(b => b.type === blockType);
      if (block) {
        const updatedSettings = [...block.settings, field];
        updateBlock(blockType, { settings: updatedSettings });
      }
      
      setNewField({ id: '', type: 'text', label: '' });
      setShowFieldForm(null);
    }
  };

  const handleUpdateFieldInBlock = (blockType: string, fieldId: string, updates: Partial<SchemaField>) => {
    const block = schema.blocks?.find(b => b.type === blockType);
    if (block) {
      const updatedSettings = block.settings.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      );
      updateBlock(blockType, { settings: updatedSettings });
      
      // If field ID is being updated, update the editingField state to track the new ID
      if (updates.id && editingField?.fieldId === fieldId && editingField?.blockType === blockType) {
        setEditingField({ blockType, fieldId: updates.id });
      }
    }
  };

  const handleRemoveFieldFromBlock = (blockType: string, fieldId: string) => {
    const block = schema.blocks?.find(b => b.type === blockType);
    if (block) {
      const updatedSettings = block.settings.filter(field => field.id !== fieldId);
      updateBlock(blockType, { settings: updatedSettings });
    }
  };

  const handleDragEnd = (event: DragEndEvent, blockType: string) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const block = schema.blocks?.find(b => b.type === blockType);
      if (block) {
        const oldIndex = block.settings.findIndex((field) => field.id === active.id);
        const newIndex = block.settings.findIndex((field) => field.id === over?.id);

        reorderBlockFields(blockType, oldIndex, newIndex);
      }
    }
  };

  const generateFieldId = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  };

  const getBlockIcon = (blockType: string) => {
    return <GripVertical className="w-4 h-4 text-gray-400" />;
  };

  const getBlockTypeLabel = (blockType: string) => {
    return 'Custom Block';
  };

  const renderFieldEditor = (blockType: string, field: SchemaField) => {
    return (
      <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-center justify-between mb-4">
          <h6 className="font-medium text-blue-900 dark:text-blue-100">Edit Field</h6>
          <button
            onClick={() => setEditingField(null)}
            className="btn-icon text-blue-600 hover:text-blue-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Field ID</label>
            <input
              type="text"
              value={field.id}
              onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { id: e.target.value })}
              className="input-field"
              placeholder="field_id"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Field Type</label>
            <select
              value={field.type}
              onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { type: e.target.value as SchemaFieldType })}
              className="input-field"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { label: e.target.value })}
              className="input-field"
              placeholder="Field label"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Info (Optional)</label>
            <input
              type="text"
              value={field.info || ''}
              onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { info: e.target.value })}
              className="input-field"
              placeholder="Help text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Default Value</label>
            <input
              type="text"
              value={field.default || ''}
              onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { default: e.target.value })}
              className="input-field"
              placeholder="Default value"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { placeholder: e.target.value })}
              className="input-field"
              placeholder="Placeholder text"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Visible If (Conditional)</label>
            <textarea
              value={field.visible_if || ''}
              onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { visible_if: e.target.value })}
              className="input-field"
              placeholder='{{ block.settings.layout_style == "flex" }}'
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Liquid expression to conditionally show this field. Use "block.settings" for block fields.
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
          
          {/* Range/Number specific fields */}
          {(['range', 'number'].includes(field.type)) && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Min Value</label>
                <input
                  type="number"
                  value={field.min || ''}
                  onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { min: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Value</label>
                <input
                  type="number"
                  value={field.max || ''}
                  onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { max: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Step</label>
                <input
                  type="number"
                  value={field.step || ''}
                  onChange={(e) => handleUpdateFieldInBlock(blockType, field.id, { step: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="input-field"
                  placeholder="1"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditingField(null)}
            className="btn-primary"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  const renderAddFieldForm = (blockType: string) => {
    return (
      <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center justify-between mb-4">
          <h6 className="font-medium text-green-900 dark:text-green-100">Add New Field</h6>
          <button
            onClick={() => {
              setShowFieldForm(null);
              setNewField({ id: '', type: 'text', label: '' });
            }}
            className="btn-icon text-green-600 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Field Label</label>
            <input
              type="text"
              value={newField.label || ''}
              onChange={(e) => {
                const label = e.target.value;
                setNewField({ 
                  ...newField, 
                  label,
                  id: generateFieldId(label)
                });
              }}
              className="input-field"
              placeholder="e.g., Heading Text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Field ID</label>
            <input
              type="text"
              value={newField.id || ''}
              onChange={(e) => setNewField({ ...newField, id: e.target.value })}
              className="input-field"
              placeholder="heading_text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Field Type</label>
            <select
              value={newField.type || 'text'}
              onChange={(e) => setNewField({ ...newField, type: e.target.value as SchemaFieldType })}
              className="input-field"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Default Value</label>
            <input
              type="text"
              value={newField.default || ''}
              onChange={(e) => setNewField({ ...newField, default: e.target.value })}
              className="input-field"
              placeholder="Default value"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Info Text (Optional)</label>
            <input
              type="text"
              value={newField.info || ''}
              onChange={(e) => setNewField({ ...newField, info: e.target.value })}
              className="input-field"
              placeholder="Help text for merchants"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Visible If (Optional)</label>
            <textarea
              value={newField.visible_if || ''}
              onChange={(e) => setNewField({ ...newField, visible_if: e.target.value })}
              className="input-field"
              placeholder='{{ block.settings.layout_style == "flex" }}'
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Conditional expression to show/hide this field
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleAddFieldToBlock(blockType)}
            className="btn-primary"
            disabled={!newField.id || !newField.label}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </button>
          <button
            onClick={() => {
              setShowFieldForm(null);
              setNewField({ id: '', type: 'text', label: '' });
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Block Editor</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Block
        </button>
      </div>

      {/* Add Block Form */}
      {showAddForm && (
        <div className="card border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h4 className="font-medium mb-4">Add New Block</h4>
          
          {/* Block Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Block Type</label>
              <input
                type="text"
                value={newBlock.type || ''}
                onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })}
                className="input-field"
                placeholder="e.g., testimonial, slide, feature"
              />
              <p className="text-xs text-gray-500 mt-1">
                Unique identifier for this block type
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Block Name</label>
              <input
                type="text"
                value={newBlock.name || ''}
                onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
                className="input-field"
                placeholder="e.g., Testimonial, Slide, Feature"
              />
              <p className="text-xs text-gray-500 mt-1">
                Display name in theme editor
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Block Limit (Optional)</label>
              <input
                type="number"
                value={newBlock.limit || ''}
                onChange={(e) => setNewBlock({ ...newBlock, limit: e.target.value ? parseInt(e.target.value) : undefined })}
                className="input-field"
                placeholder="No limit"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum instances of this block type
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddBlock}
              className="btn-primary"
              disabled={!newBlock.type || !newBlock.name}
            >
              Add Block
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewBlock({ type: '', name: '', settings: [] });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Blocks List */}
      <div className="space-y-4">
        {schema.blocks && schema.blocks.length > 0 ? (
          schema.blocks.map((block, index) => (
            <div key={block.type} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getBlockIcon(block.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{block.name}</h4>
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                        {getBlockTypeLabel(block.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Type: {block.type}</p>
                    {block.limit && (
                      <p className="text-xs text-gray-400">Limit: {block.limit}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {block.settings.length} fields
                  </span>
                  <button
                    onClick={() => setEditingBlock(editingBlock === block.type ? null : block.type)}
                    className="btn-icon"
                    title="Edit block"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeBlock(block.type)}
                    className="btn-icon text-red-600 hover:text-red-700"
                    title="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Block Settings - Only for custom blocks */}
              {editingBlock === block.type && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Block Name</label>
                      <input
                        type="text"
                        value={block.name}
                        onChange={(e) => handleUpdateBlock(block.type, { name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Block Limit</label>
                      <input
                        type="number"
                        value={block.limit || ''}
                        onChange={(e) => handleUpdateBlock(block.type, { 
                          limit: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        className="input-field"
                        placeholder="No limit"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Block Fields */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Block Fields</h5>
                      <button
                        onClick={() => setShowFieldForm(block.type)}
                        className="btn-secondary text-sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Field
                      </button>
                    </div>

                    {/* Add Field Form */}
                    {showFieldForm === block.type && renderAddFieldForm(block.type)}

                    {block.settings.length > 0 ? (
                      <div className="space-y-2">
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) => handleDragEnd(event, block.type)}
                        >
                          <SortableContext
                            items={block.settings.map(field => field.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {block.settings.map((field, fieldIndex) => (
                              <div key={field.id}>
                                {/* Field Display */}
                                {editingField?.blockType !== block.type || editingField?.fieldId !== field.id ? (
                                  <SortableBlockFieldItem
                                    field={field}
                                    blockType={block.type}
                                    onEdit={() => setEditingField({ blockType: block.type, fieldId: field.id })}
                                    onDelete={() => handleRemoveFieldFromBlock(block.type, field.id)}
                                  />
                                ) : (
                                  /* Field Editor */
                                  renderFieldEditor(block.type, field)
                                )}
                              </div>
                            ))}
                          </SortableContext>
                        </DndContext>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p className="text-sm">No fields added yet</p>
                        <p className="text-xs mt-1">Click "Add Field" to create block settings</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Settings className="w-8 h-8" />
            </div>
            <h4 className="font-medium mb-2">No blocks created yet</h4>
            <p className="text-sm mb-4">
              Blocks are reusable modules that merchants can add, remove, and reorder within a section.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Create Your First Block
            </button>
          </div>
        )}
      </div>

      {/* Block Usage Info */}
      {schema.blocks && schema.blocks.length > 0 && (
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Block Usage</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>• Blocks can be added, removed, and reordered by merchants in the theme editor</p>
            <p>• Each block type can have its own settings and limits</p>
            <p>• Use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{'{{ block.shopify_attributes }}'}</code> in your Liquid template</p>
            <p>• For app blocks, use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{'{% content_for "blocks" %}'}</code></p>
            <p>• Use drag handle to reorder block fields</p>
            <p>• Maximum {schema.max_blocks || 50} blocks per section (static blocks don't count)</p>
          </div>
        </div>
      )}
    </div>
  );
} 