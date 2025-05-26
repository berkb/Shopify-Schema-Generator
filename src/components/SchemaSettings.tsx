'use client';

import { useState } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { useSchemaStore } from '@/store/schemaStore';

export function SchemaSettings() {
  const { schema, updateSchema } = useSchemaStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newLocale, setNewLocale] = useState({ key: '', value: '' });

  const templateTypes = [
    'index', 'product', 'collection', 'blog', 'article', 'page', 'cart', 
    'search', 'customers/login', 'customers/register', 'customers/account',
    'customers/order', 'customers/addresses', 'customers/reset_password',
    'customers/activate_account', 'gift_card', 'password', '404', 'list-collections'
  ];

  const sectionGroups = [
    'header', 'footer', 'aside', 'custom.announcement', 'custom.newsletter'
  ];

  const htmlTags = [
    'section', 'div', 'article', 'aside', 'header', 'footer', 'main', 'nav'
  ];

  const handleTemplateToggle = (template: string, type: 'enabled' | 'disabled') => {
    const currentList = type === 'enabled' 
      ? schema.enabled_on?.templates || []
      : schema.disabled_on?.templates || [];
    
    const isSelected = currentList.includes(template);
    const newList = isSelected 
      ? currentList.filter(t => t !== template)
      : [...currentList, template];

    if (type === 'enabled') {
      updateSchema({
        enabled_on: { ...schema.enabled_on, templates: newList },
        disabled_on: undefined // Clear disabled_on when using enabled_on
      });
    } else {
      updateSchema({
        disabled_on: { ...schema.disabled_on, templates: newList },
        enabled_on: undefined // Clear enabled_on when using disabled_on
      });
    }
  };

  const handleGroupToggle = (group: string, type: 'enabled' | 'disabled') => {
    const currentList = type === 'enabled' 
      ? schema.enabled_on?.groups || []
      : schema.disabled_on?.groups || [];
    
    const isSelected = currentList.includes(group);
    const newList = isSelected 
      ? currentList.filter(g => g !== group)
      : [...currentList, group];

    if (type === 'enabled') {
      updateSchema({
        enabled_on: { ...schema.enabled_on, groups: newList },
        disabled_on: undefined
      });
    } else {
      updateSchema({
        disabled_on: { ...schema.disabled_on, groups: newList },
        enabled_on: undefined
      });
    }
  };

  const addLocale = () => {
    if (newLocale.key && newLocale.value) {
      const currentLocales = schema.locales || {};
      updateSchema({
        locales: {
          ...currentLocales,
          en: {
            ...currentLocales.en,
            [newLocale.key]: newLocale.value
          }
        }
      });
      setNewLocale({ key: '', value: '' });
    }
  };

  const removeLocale = (key: string) => {
    if (schema.locales?.en) {
      const { [key]: removed, ...rest } = schema.locales.en;
      updateSchema({
        locales: {
          ...schema.locales,
          en: rest
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Schema Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Schema Name</label>
          <input
            type="text"
            value={schema.name}
            onChange={(e) => updateSchema({ name: e.target.value })}
            className="input-field"
            placeholder="Enter schema name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">HTML Tag</label>
          <select
            value={schema.tag || 'section'}
            onChange={(e) => updateSchema({ tag: e.target.value })}
            className="input-field"
          >
            {htmlTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            The HTML element that wraps the section content. Default: section
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">CSS Class</label>
          <input
            type="text"
            value={schema.class || ''}
            onChange={(e) => updateSchema({ class: e.target.value })}
            className="input-field"
            placeholder="CSS class name"
          />
          <p className="text-xs text-gray-500 mt-1">
            CSS class applied to the section wrapper element
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Blocks</label>
          <input
            type="number"
            value={schema.max_blocks || ''}
            onChange={(e) => updateSchema({ max_blocks: e.target.value ? parseInt(e.target.value) : undefined })}
            className="input-field"
            placeholder="50 (default)"
            min="1"
            max="50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of blocks per section (default: 50, static blocks don't count)
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Info className="w-4 h-4" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-6 border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
            
            <div>
              <h4 className="font-medium mb-3">Template & Group Restrictions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Control where this section can be used. You can use either enabled_on OR disabled_on, not both.
                <br />
                <a 
                  href="https://shopify.dev/docs/storefronts/themes/architecture/settings#conditional-settings" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Learn more about conditional settings
                </a>
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">Enabled On (Whitelist)</h5>
                  <p className="text-xs text-gray-500 mb-3">Section will ONLY be available on selected templates/groups</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Templates</label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {templateTypes.map(template => (
                          <label key={template} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={schema.enabled_on?.templates?.includes(template) || false}
                              onChange={() => handleTemplateToggle(template, 'enabled')}
                              disabled={!!schema.disabled_on}
                              className="rounded"
                            />
                            {template}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Section Groups</label>
                      <div className="space-y-1">
                        {sectionGroups.map(group => (
                          <label key={group} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={schema.enabled_on?.groups?.includes(group) || false}
                              onChange={() => handleGroupToggle(group, 'enabled')}
                              disabled={!!schema.disabled_on}
                              className="rounded"
                            />
                            {group}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-red-700 dark:text-red-300 mb-2">Disabled On (Blacklist)</h5>
                  <p className="text-xs text-gray-500 mb-3">Section will be available everywhere EXCEPT selected templates/groups</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Templates</label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {templateTypes.map(template => (
                          <label key={template} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={schema.disabled_on?.templates?.includes(template) || false}
                              onChange={() => handleTemplateToggle(template, 'disabled')}
                              disabled={!!schema.enabled_on}
                              className="rounded"
                            />
                            {template}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Section Groups</label>
                      <div className="space-y-1">
                        {sectionGroups.map(group => (
                          <label key={group} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={schema.disabled_on?.groups?.includes(group) || false}
                              onChange={() => handleGroupToggle(group, 'disabled')}
                              disabled={!!schema.enabled_on}
                              className="rounded"
                            />
                            {group}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Locales (Translations)</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Add translation strings that will appear in the theme editor's language section.
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLocale.key}
                    onChange={(e) => setNewLocale({ ...newLocale, key: e.target.value })}
                    className="input-field flex-1"
                    placeholder="Translation key (e.g., title)"
                  />
                  <input
                    type="text"
                    value={newLocale.value}
                    onChange={(e) => setNewLocale({ ...newLocale, value: e.target.value })}
                    className="input-field flex-1"
                    placeholder="Translation value"
                  />
                  <button
                    onClick={addLocale}
                    disabled={!newLocale.key || !newLocale.value}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {schema.locales?.en && Object.keys(schema.locales.en).length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Current Translations:</h5>
                    {Object.entries(schema.locales.en).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <div className="flex-1">
                          <span className="font-mono text-sm">{key}</span>
                          <span className="text-gray-500 mx-2">→</span>
                          <span className="text-sm">{value as string}</span>
                        </div>
                        <button
                          onClick={() => removeLocale(key)}
                          className="btn-icon text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500">
                      Access in Liquid: <code>{'{{ "sections.section_name.' + Object.keys(schema.locales.en)[0] + '" | t }}'}</code>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Default Configuration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                For statically rendered sections. Use presets for dynamic sections instead.
              </p>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!schema.default}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateSchema({
                          default: {
                            name: schema.name + ' Default',
                            settings: {}
                          }
                        });
                      } else {
                        updateSchema({ default: undefined });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">Enable default configuration for static rendering</span>
                </label>
                
                {schema.default && (
                  <div className="pl-6 space-y-2">
                    <input
                      type="text"
                      value={schema.default.name || ''}
                      onChange={(e) => updateSchema({
                        default: { ...schema.default, name: e.target.value }
                      })}
                      className="input-field"
                      placeholder="Default configuration name"
                    />
                    <p className="text-xs text-gray-500">
                      Default settings will be populated from your current section settings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 