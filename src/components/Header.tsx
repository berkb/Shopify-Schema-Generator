'use client';

import { Moon, Sun, Download, Upload, Settings, Github } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useSchemaStore } from '@/store/schemaStore';
import { exportSchema, importSchema } from '@/lib/utils';
import toast from 'react-hot-toast';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { schema, loadSchema, exportOptions } = useSchemaStore();

  const handleExport = () => {
    try {
      const exported = exportSchema(schema, exportOptions);
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${schema.name.toLowerCase().replace(/\s+/g, '-')}-schema.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Schema exported successfully!');
    } catch (error) {
      toast.error('Failed to export schema');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const importedSchema = importSchema(content);
            loadSchema(importedSchema);
            toast.success('Schema imported successfully!');
          } catch (error) {
            toast.error('Failed to import schema');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-shopify-500 to-shopify-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Shopify Schema Generator
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Advanced theme schema builder
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleImport}
            className="btn-secondary flex items-center space-x-2"
            title="Import Schema"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={handleExport}
            className="btn-primary flex items-center space-x-2"
            title="Export Schema"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="https://github.com/berkb/Shopify-Schema-Generator"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 transition-colors"
            title="View on GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </header>
  );
} 