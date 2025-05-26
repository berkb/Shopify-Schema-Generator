'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit3, GripVertical } from 'lucide-react';
import { useSchemaStore } from '@/store/schemaStore';
import { SchemaField, SchemaFieldType } from '@/types/schema';
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableFieldItemProps {
  field: SchemaField;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableFieldItem({ field, index, isSelected, onSelect, onEdit, onDelete }: SortableFieldItemProps) {
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
      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{field.label}</span>
            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              {field.type}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">ID: {field.id}</p>
          {field.info && (
            <p className="text-xs text-gray-400 mt-1">Info: {field.info}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="btn-icon"
          title="Edit field"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="btn-icon text-red-600 hover:text-red-700"
          title="Delete field"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function FieldList() {
  const { schema, selectedField, addField, removeField, setSelectedField, reorderFields } = useSchemaStore();
  const [showAddForm, setShowAddForm] = useState(false);
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

  const generateFieldId = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  };

  const handleAddField = () => {
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
      addField(field);
      setNewField({ id: '', type: 'text', label: '' });
      setShowAddForm(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = schema.settings.findIndex((field) => field.id === active.id);
      const newIndex = schema.settings.findIndex((field) => field.id === over?.id);

      reorderFields(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Section Fields</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      {/* Add Field Form */}
      {showAddForm && (
        <div className="card border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h4 className="font-medium mb-4">Add New Field</h4>
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
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddField}
              className="btn-primary"
              disabled={!newField.id || !newField.label}
            >
              Add Field
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewField({ id: '', type: 'text', label: '' });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fields List */}
      <div className="space-y-3">
        {schema.settings.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={schema.settings.map(field => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {schema.settings.map((field, index) => (
                <SortableFieldItem
                  key={field.id}
                  field={field}
                  index={index}
                  isSelected={selectedField === field.id}
                  onSelect={() => setSelectedField(field.id)}
                  onEdit={() => setSelectedField(field.id)}
                  onDelete={() => removeField(field.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            <h4 className="font-medium mb-2">No fields created yet</h4>
            <p className="text-sm mb-4">
              Fields are the settings that merchants can customize in the theme editor.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Create Your First Field
            </button>
          </div>
        )}
      </div>

      {/* Field Usage Info */}
      {schema.settings.length > 0 && (
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Field Usage</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>• Access field values in Liquid with <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{'{{ section.settings.field_id }}'}</code></p>
            <p>• Use drag handle to reorder fields</p>
            <p>• Field order affects the theme editor layout</p>
            <p>• Maximum 50 settings per section</p>
          </div>
        </div>
      )}
    </div>
  );
} 