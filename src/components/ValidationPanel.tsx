'use client';

import { useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSchemaStore } from '@/store/schemaStore';
import { validateSchema } from '@/lib/utils';

export function ValidationPanel() {
  const { schema, validationErrors, setValidationErrors } = useSchemaStore();

  useEffect(() => {
    const errors = validateSchema(schema);
    setValidationErrors(errors);
  }, [schema, setValidationErrors]);

  const errorCount = validationErrors.filter(e => e.type === 'error').length;
  const warningCount = validationErrors.filter(e => e.type === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Schema Validation</h3>
        <div className="flex items-center space-x-4 text-sm">
          {errorCount > 0 && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle size={16} />
              <span>{errorCount} errors</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center space-x-1 text-yellow-600">
              <AlertTriangle size={16} />
              <span>{warningCount} warnings</span>
            </div>
          )}
          {errorCount === 0 && warningCount === 0 && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle size={16} />
              <span>No issues</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {validationErrors.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              Schema is valid!
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Your schema passes all validation checks.
            </p>
          </div>
        ) : (
          validationErrors.map((error, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                error.type === 'error'
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
              }`}
            >
              <div className="flex items-start space-x-3">
                {error.type === 'error' ? (
                  <AlertCircle size={20} className="text-red-600 mt-0.5" />
                ) : (
                  <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {error.field}
                  </div>
                  <div className={`text-sm mt-1 ${
                    error.type === 'error' 
                      ? 'text-red-700 dark:text-red-300' 
                      : 'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {error.message}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {validationErrors.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Validation Tips
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• All fields must have unique IDs</li>
            <li>• Field labels are required for user interface</li>
            <li>• Range fields need min and max values</li>
            <li>• Select and radio fields require options</li>
          </ul>
        </div>
      )}
    </div>
  );
} 