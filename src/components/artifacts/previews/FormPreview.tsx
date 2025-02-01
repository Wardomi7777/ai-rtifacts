import React from 'react';
import { FormArtifact } from '../../../types/artifacts';

interface FormPreviewProps {
  artifact: FormArtifact;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ artifact }) => {
  return (
    <div className="h-full bg-white/50 backdrop-blur-sm flex flex-col">
      <div className="flex-1 p-6 space-y-4">
        {artifact.fields.slice(0, 3).map((field) => (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                disabled
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
              >
                <option>{field.placeholder || 'Select an option'}</option>
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                disabled
                placeholder={field.placeholder}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 resize-none"
                rows={2}
              />
            ) : (
              <input
                type={field.type}
                disabled
                placeholder={field.placeholder}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
              />
            )}
          </div>
        ))}
        {artifact.fields.length > 3 && (
          <div className="text-sm text-gray-500 text-center">
            +{artifact.fields.length - 3} more fields
          </div>
        )}
      </div>
    </div>
  );
};