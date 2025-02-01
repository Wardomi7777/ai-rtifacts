import React, { useState } from 'react';
import { FormArtifact } from '../../types/artifacts';
import { Send, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { FormImport } from './form/FormImport';
import { FormAutofill } from './form/FormAutofill';
import { ArtifactTypeSelector } from '../chat/ArtifactTypeSelector';
import { useArtifactStore } from '../../store/useArtifactStore';

interface FormRendererProps {
  data: FormArtifact;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ data }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const { submitForm, loading, error: submitError } = useFormSubmission();
  const [showTransform, setShowTransform] = useState(false);
  const { generateArtifact } = useArtifactStore();

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (field.validation) {
      const { pattern, min, max, minLength, maxLength } = field.validation;

      if (pattern && !new RegExp(pattern).test(value)) {
        return 'Invalid format';
      }

      if (field.type === 'number') {
        const num = Number(value);
        if (min !== undefined && num < min) return `Minimum value is ${min}`;
        if (max !== undefined && num > max) return `Maximum value is ${max}`;
      }

      if (['text', 'textarea'].includes(field.type)) {
        if (minLength !== undefined && value.length < minLength) {
          return `Minimum length is ${minLength} characters`;
        }
        if (maxLength !== undefined && value.length > maxLength) {
          return `Maximum length is ${maxLength} characters`;
        }
      }
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    data.fields.forEach(field => {
      const value = formData[field.id] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      submitForm(data.instructions, formData).then(response => {
        setResult(response);
      });
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      value: formData[field.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [field.id]: e.target.value }));
        if (errors[field.id]) {
          setErrors(prev => ({ ...prev, [field.id]: '' }));
        }
      },
      placeholder: field.placeholder,
      required: field.required,
      className: `w-full px-4 py-2 rounded-lg border ${
        errors[field.id]
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
      } focus:ring-2 focus:ring-opacity-50 transition-colors`
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            {...commonProps}
            type={field.type}
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Form Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            {data.title && (
              <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
            )}
            {data.description && (
              <p className="text-gray-600 mt-1">{data.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <FormImport
              fields={data.fields}
              onImport={(values) => setFormData(values)}
            />
            <FormAutofill
              fields={data.fields}
              onAutofill={(values) => setFormData(values)}
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {data.fields.map(field => (
            <div key={field.id} className="space-y-2">
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {renderField(field)}
              {errors[field.id] && (
                <p className="text-sm text-red-600">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Results Section */}
        {(result || submitError) && (
          <div className={`bg-white rounded-lg shadow-sm p-6 ${
            submitError ? 'border-red-200' : 'border-green-200'
          } border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {submitError ? 'Error' : 'Result'}
              </h3>
              {result && !submitError && (
                <button
                  onClick={() => setShowTransform(!showTransform)}
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Transform
                </button>
              )}
            </div>

            {submitError ? (
              <p className="text-red-600">{submitError}</p>
            ) : (
              <div className="space-y-4">
                <div className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result || ''}
                  </ReactMarkdown>
                </div>

                {showTransform && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Transform to:
                    </h4>
                    <ArtifactTypeSelector
                      selected="document"
                      onSelect={async (type) => {
                        if (result) {
                          await generateArtifact(result, type);
                          setShowTransform(false);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send size={20} />
              {data.submitLabel || 'Submit'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};