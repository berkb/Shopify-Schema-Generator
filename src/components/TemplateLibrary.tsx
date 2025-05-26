'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { useSchemaStore } from '@/store/schemaStore';
import { SchemaTemplate } from '@/types/schema';
import { templates } from '@/lib/templates';
import toast from 'react-hot-toast';

export function TemplateLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<SchemaTemplate | null>(null);
  const { loadSchema } = useSchemaStore();

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'basic', label: 'Basic' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'content', label: 'Content' },
    { id: 'layout', label: 'Layout' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: SchemaTemplate) => {
    loadSchema(template.schema);
    toast.success(`Template "${template.name}" loaded successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Template Library
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Choose from pre-built schema templates to get started quickly
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {template.name}
                </h3>
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-full mt-1">
                  {template.category}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {template.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{template.schema.settings.length} fields</span>
              <span>{template.schema.blocks?.length || 0} blocks</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTemplate(template)}
                className="btn-secondary flex-1 flex items-center justify-center space-x-1"
              >
                <Eye size={14} />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => handleUseTemplate(template)}
                className="btn-primary flex-1 flex items-center justify-center space-x-1"
              >
                <Download size={14} />
                <span>Use</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-2">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            No templates found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedTemplate.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-auto">
              <pre className="code-block">
                <code>{JSON.stringify(selectedTemplate.schema, null, 2)}</code>
              </pre>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-dark-700 flex justify-end space-x-3 flex-shrink-0">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="btn-secondary px-6 py-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUseTemplate(selectedTemplate);
                  setSelectedTemplate(null);
                }}
                className="btn-primary px-6 py-2"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 