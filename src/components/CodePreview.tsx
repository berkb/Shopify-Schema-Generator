'use client';

import { useState } from 'react';
import { Copy, Download, Eye, Code } from 'lucide-react';
import { useSchemaStore } from '@/store/schemaStore';
import { exportSchema, copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

export function CodePreview() {
  const [viewMode, setViewMode] = useState<'formatted' | 'minified'>('formatted');
  const { schema, exportOptions, setExportOptions } = useSchemaStore();

  const generatedCode = exportSchema(schema, {
    ...exportOptions,
    minify: viewMode === 'minified'
  });

  const handleCopy = async () => {
    try {
      await copyToClipboard(generatedCode);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { 
      type: exportOptions.format === 'json' ? 'application/json' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema.name.toLowerCase().replace(/\s+/g, '-')}-schema.${exportOptions.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Code Preview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Preview and export your generated schema
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('formatted')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'formatted'
                  ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Eye size={14} className="inline mr-1" />
              Formatted
            </button>
            <button
              onClick={() => setViewMode('minified')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'minified'
                  ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Code size={14} className="inline mr-1" />
              Minified
            </button>
          </div>
          
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center space-x-2"
          >
            <Copy size={16} />
            <span>Copy</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Export Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select
              value={exportOptions.format}
              onChange={(e) => setExportOptions({ format: e.target.value as 'json' | 'liquid' })}
              className="input-field"
            >
              <option value="json">JSON</option>
              <option value="liquid">Liquid</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeComments"
              checked={exportOptions.includeComments}
              onChange={(e) => setExportOptions({ includeComments: e.target.checked })}
              className="rounded border-gray-300 text-shopify-600 focus:ring-shopify-500"
            />
            <label htmlFor="includeComments" className="text-sm font-medium">
              Include Comments
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includePresets"
              checked={exportOptions.includePresets}
              onChange={(e) => setExportOptions({ includePresets: e.target.checked })}
              className="rounded border-gray-300 text-shopify-600 focus:ring-shopify-500"
            />
            <label htmlFor="includePresets" className="text-sm font-medium">
              Include Presets
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeBlocks"
              checked={exportOptions.includeBlocks}
              onChange={(e) => setExportOptions({ includeBlocks: e.target.checked })}
              className="rounded border-gray-300 text-shopify-600 focus:ring-shopify-500"
            />
            <label htmlFor="includeBlocks" className="text-sm font-medium">
              Include Blocks
            </label>
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Generated Code</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {generatedCode.length} characters
          </div>
        </div>
        
        <div className="relative">
          <pre className="code-block max-h-96 overflow-auto break-words whitespace-pre-wrap">
            <code className="break-words">{generatedCode}</code>
          </pre>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Usage Instructions</h3>
        
        <div className="prose dark:prose-invert max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Copy the generated schema code above</li>
            <li>
              {exportOptions.format === 'json' 
                ? 'Paste it into your Shopify theme section file within the {% schema %} tags'
                : 'Paste it directly into your Shopify theme section file'
              }
            </li>
            <li>Save the file and upload to your theme</li>
            <li>The section will now be available in the theme customizer</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Always test your schema in a development theme before applying to production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 