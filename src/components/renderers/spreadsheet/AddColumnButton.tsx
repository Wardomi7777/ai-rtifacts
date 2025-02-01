import React, { useState } from 'react';
import { Plus, Loader } from 'lucide-react';
import { useSpreadsheetColumn } from '../../../hooks/useSpreadsheetColumn';

interface AddColumnButtonProps {
  columns: string[];
  rows: string[][];
  onAddColumn: (newData: { columns: string[]; rows: string[][] }) => void;
  className?: string;
}

export const AddColumnButton: React.FC<AddColumnButtonProps> = ({
  columns,
  rows,
  onAddColumn,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnName, setColumnName] = useState('');
  const { generateColumn, loading, error } = useSpreadsheetColumn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!columnName.trim() || loading) return;

    try {
      const result = await generateColumn(columnName, columns, rows);
      if (result) {
        onAddColumn(result);
        setIsModalOpen(false);
        setColumnName('');
      }
    } catch (err) {
      console.error('Failed to generate column:', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
        title="Add new column"
      >
        <Plus size={20} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Column
              </h3>
              
              <div className="space-y-2">
                <label htmlFor="columnName" className="block text-sm font-medium text-gray-700">
                  Column Name
                </label>
                <input
                  type="text"
                  id="columnName"
                  value={columnName}
                  onChange={(e) => setColumnName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter column name"
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !columnName.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Add Column'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};