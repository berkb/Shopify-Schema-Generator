'use client';

import { useState } from 'react';
import { Plus, Settings, AlertCircle } from 'lucide-react';
import { useSchemaStore } from '@/store/schemaStore';
import { SchemaSettings } from './SchemaSettings';
import { FieldList } from './FieldList';
import { FieldEditor } from './FieldEditor';
import { BlockEditor } from './BlockEditor';
import { ValidationPanel } from './ValidationPanel';

export function SchemaBuilder() {
  const [activePanel, setActivePanel] = useState<'settings' | 'fields' | 'blocks' | 'validation'>('fields');
  const { schema, validationErrors } = useSchemaStore();

  const panels = [
    {
      id: 'settings' as const,
      label: 'Schema Settings',
      icon: Settings,
      count: null
    },
    {
      id: 'fields' as const,
      label: 'Fields',
      icon: Plus,
      count: schema.settings.length
    },
    {
      id: 'blocks' as const,
      label: 'Blocks',
      icon: Plus,
      count: schema.blocks?.length || 0
    },
    {
      id: 'validation' as const,
      label: 'Validation',
      icon: AlertCircle,
      count: validationErrors.length
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Left Panel - Navigation */}
      <div className="lg:col-span-1">
        <div className="card h-full">
          <h2 className="text-lg font-semibold mb-4">Schema Builder</h2>
          
          <nav className="space-y-2">
            {panels.map((panel) => {
              const Icon = panel.icon;
              const isActive = activePanel === panel.id;
              
              return (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-shopify-50 dark:bg-shopify-900/20 text-shopify-700 dark:text-shopify-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={16} />
                    <span>{panel.label}</span>
                  </div>
                  {panel.count !== null && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive
                        ? 'bg-shopify-100 dark:bg-shopify-800 text-shopify-700 dark:text-shopify-300'
                        : 'bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {panel.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Schema Name:</span>
                <span className="font-medium">{schema.name}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Fields:</span>
                <span className="font-medium">{schema.settings.length}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Blocks:</span>
                <span className="font-medium">{schema.blocks?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="lg:col-span-2">
        <div className="card h-full overflow-hidden">
          {activePanel === 'settings' && <SchemaSettings />}
          {activePanel === 'fields' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full">
              <FieldList />
              <FieldEditor />
            </div>
          )}
          {activePanel === 'blocks' && <BlockEditor />}
          {activePanel === 'validation' && <ValidationPanel />}
        </div>
      </div>
    </div>
  );
} 