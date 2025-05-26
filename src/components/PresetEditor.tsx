'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit3, X, Check, Tag, Layers, Copy } from 'lucide-react';
import { useSchemaStore } from '@/store/schemaStore';
import { SchemaPreset } from '@/types/schema';

export function PresetEditor() {
  const { schema, addPreset, updatePreset, removePreset } = useSchemaStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [newPreset, setNewPreset] = useState<Partial<SchemaPreset>>({
    name: '',
    category: '',
    settings: {},
    blocks: []
  });

  const categories = [
    'Layout', 'Content', 'Media', 'Commerce', 'Social', 'Navigation', 
    'Hero', 'Features', 'Testimonials', 'Gallery', 'Contact', 'Footer'
  ];

  const handleAddPreset = () => {
    if (newPreset.name) {
      const preset: SchemaPreset = {
        name: newPreset.name,
        category: newPreset.category || undefined,
        settings: newPreset.settings || {},
        blocks: newPreset.blocks || []
      };
      addPreset(preset);
      setNewPreset({ name: '', category: '', settings: {}, blocks: [] });
      setShowAddForm(false);
    }
  };

  const handleUpdatePreset = (index: number, updates: Partial<SchemaPreset>) => {
    // Ensure all required fields are present
    const updatedPreset: SchemaPreset = {
      name: updates.name || '',
      category: updates.category || '',
      settings: updates.settings || {},
      blocks: updates.blocks || []
    };
    updatePreset(index, updatedPreset);
  };

  const duplicatePreset = (preset: SchemaPreset) => {
    const duplicated: SchemaPreset = {
      ...preset,
      name: preset.name + ' Copy'
    };
    addPreset(duplicated);
  };

  const addBlockToPreset = (presetIndex: number) => {
    const preset = schema.presets?.[presetIndex];
    if (preset && schema.blocks && schema.blocks.length > 0) {
      const firstBlock = schema.blocks[0];
      const newBlock = {
        type: firstBlock.type,
        name: firstBlock.name,
        settings: {}
      };
      
      const updatedBlocks = [...(preset.blocks || []), newBlock];
      handleUpdatePreset(presetIndex, { blocks: updatedBlocks });
    }
  };

  const removeBlockFromPreset = (presetIndex: number, blockIndex: number) => {
    const preset = schema.presets?.[presetIndex];
    if (preset?.blocks) {
      const updatedBlocks = preset.blocks.filter((_, i) => i !== blockIndex);
      handleUpdatePreset(presetIndex, { blocks: updatedBlocks });
    }
  };

  const updateBlockInPreset = (presetIndex: number, blockIndex: number, updates: any) => {
    const preset = schema.presets?.[presetIndex];
    if (preset?.blocks) {
      const updatedBlocks = preset.blocks.map((block, i) => 
        i === blockIndex ? { ...block, ...updates } : block
      );
      handleUpdatePreset(presetIndex, { blocks: updatedBlocks });
    }
  };

  const generatePresetFromCurrentSettings = () => {
    const currentSettings: Record<string, any> = {};
    
    // Generate sample settings based on schema fields
    schema.settings.forEach(field => {
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'richtext':
          currentSettings[field.id] = field.default || 'Sample text';
          break;
        case 'number':
        case 'range':
          currentSettings[field.id] = field.default || field.min || 1;
          break;
        case 'checkbox':
          currentSettings[field.id] = field.default || false;
          break;
        case 'color':
        case 'color_background':
          currentSettings[field.id] = field.default || '#000000';
          break;
        case 'url':
          currentSettings[field.id] = field.default || 'https://example.com';
          break;
        case 'select':
        case 'radio':
          currentSettings[field.id] = field.default || field.options?.[0]?.value || '';
          break;
        default:
          currentSettings[field.id] = field.default || '';
      }
    });

    setNewPreset({
      ...newPreset,
      settings: currentSettings
    });
  };

  const groupedPresets = schema.presets?.reduce((groups, preset, index) => {
    const category = preset.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push({ preset, index });
    return groups;
  }, {} as Record<string, Array<{ preset: SchemaPreset; index: number }>>) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preset Editor</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Preset
        </button>
      </div>

      {/* Add Preset Form */}
      {showAddForm && (
        <div className="card border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h4 className="font-medium mb-4">Add New Preset</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preset Name</label>
                <input
                  type="text"
                  value={newPreset.name || ''}
                  onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Hero with Image, Simple Layout"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category (Optional)</label>
                <select
                  value={newPreset.category || ''}
                  onChange={(e) => setNewPreset({ ...newPreset, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">No category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={generatePresetFromCurrentSettings}
                className="btn-secondary text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Use Current Settings
              </button>
              <span className="text-sm text-gray-500">
                Generate preset with sample values from schema fields
              </span>
            </div>

            {/* Settings Preview */}
            {newPreset.settings && Object.keys(newPreset.settings).length > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h5 className="text-sm font-medium mb-2">Preset Settings:</h5>
                <div className="text-xs font-mono space-y-1">
                  {Object.entries(newPreset.settings).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-blue-600 dark:text-blue-400">{key}:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {typeof value === 'string' ? `"${value}"` : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddPreset}
              className="btn-primary"
              disabled={!newPreset.name}
            >
              Add Preset
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewPreset({ name: '', category: '', settings: {}, blocks: [] });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Presets List */}
      <div className="space-y-6">
        {Object.keys(groupedPresets).length > 0 ? (
          Object.entries(groupedPresets).map(([category, presets]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {category}
                </h4>
                <span className="text-sm text-gray-500">({presets.length})</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {presets.map(({ preset, index }) => (
                  <div key={index} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium">{preset.name}</h5>
                        {preset.category && (
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                            {preset.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => duplicatePreset(preset)}
                          className="btn-icon"
                          title="Duplicate preset"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingPreset(editingPreset === `${index}` ? null : `${index}`)}
                          className="btn-icon"
                          title="Edit preset"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removePreset(index)}
                          className="btn-icon text-red-600 hover:text-red-700"
                          title="Delete preset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preset Info */}
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Settings: {Object.keys(preset.settings || {}).length} configured</p>
                      <p>Blocks: {preset.blocks?.length || 0} included</p>
                    </div>

                    {/* Edit Form */}
                    {editingPreset === `${index}` && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Preset Name</label>
                            <input
                              type="text"
                              value={preset.name}
                              onChange={(e) => handleUpdatePreset(index, { name: e.target.value })}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                              value={preset.category || ''}
                              onChange={(e) => handleUpdatePreset(index, { 
                                category: e.target.value || undefined 
                              })}
                              className="input-field"
                            >
                              <option value="">No category</option>
                              {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Preset Blocks */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-medium">Preset Blocks</h6>
                            {schema.blocks && schema.blocks.length > 0 && (
                              <button
                                onClick={() => addBlockToPreset(index)}
                                className="btn-secondary text-sm"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Block
                              </button>
                            )}
                          </div>

                          {preset.blocks && preset.blocks.length > 0 ? (
                            <div className="space-y-2">
                              {preset.blocks.map((block, blockIndex) => (
                                <div key={blockIndex} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-gray-400" />
                                    <select
                                      value={block.type}
                                      onChange={(e) => updateBlockInPreset(index, blockIndex, { 
                                        type: e.target.value,
                                        name: schema.blocks?.find(b => b.type === e.target.value)?.name || block.name
                                      })}
                                      className="text-sm border rounded px-2 py-1"
                                    >
                                      {schema.blocks?.map(schemaBlock => (
                                        <option key={schemaBlock.type} value={schemaBlock.type}>
                                          {schemaBlock.name} ({schemaBlock.type})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <button
                                    onClick={() => removeBlockFromPreset(index, blockIndex)}
                                    className="btn-icon text-red-600 hover:text-red-700 text-sm"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No blocks in this preset
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingPreset(null)}
                            className="btn-primary"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Tag className="w-8 h-8" />
            </div>
            <h4 className="font-medium mb-2">No presets created yet</h4>
            <p className="text-sm mb-4">
              Presets provide predefined configurations for merchants to quickly set up sections.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Create Your First Preset
            </button>
          </div>
        )}
      </div>

      {/* Preset Usage Info */}
      {schema.presets && schema.presets.length > 0 && (
        <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Preset Usage</h4>
          <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <p>• Presets appear in the theme editor's "Add section" picker</p>
            <p>• Categorized presets are grouped together for better organization</p>
            <p>• Uncategorized presets appear first in the picker</p>
            <p>• Each preset can include default settings and blocks</p>
            <p>• Merchants can select presets to quickly configure sections</p>
          </div>
        </div>
      )}
    </div>
  );
} 