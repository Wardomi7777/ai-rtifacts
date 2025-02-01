import React, { useState } from 'react';
import { Plus, Loader } from 'lucide-react';
import { useSpreadsheetRow } from '../../../hooks/useSpreadsheetRow';

interface AddRowButtonProps {
  columns: string[];
  rows: string[][];
  onAddRow: (newData: { columns: string[]; rows: string[][] }) => void;
  className?: string;
}

export const AddRowButton: React.FC<AddRowButtonProps> = ({
  columns,
  rows,
  onAddRow,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState<Record<string, string>>({});
  const { generateRow, loading, error } = useSpreadsheetRow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(rowData).length === 0 || loading) return;

    try {
      const result = await generateRow(rowData, columns, rows);
      if (result) {
        onAddRow(result);
        setIsModalOpen(false);
        setRowData({});
      }
    } catch (err) {
      console.error('Failed to generate row:', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
        title="Add new row"
      >
        <Plus size={20} className="rotate-90" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Row
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {columns.map((column) => (
                  <div key={column} className="space-y-2">
                    <label htmlFor={column} className="block text-sm font-medium text-gray-700">
                      {column}
                    </label>
                    <input
                      type="text"
                      id={column}
                      value={rowData[column] || ''}
                      onChange={(e) => setRowData(prev => ({
                        ...prev,
                        [column]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder={`Enter ${column.toLowerCase()}`}
                      disabled={loading}
                    />
                  </div>
                ))}
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
                  disabled={loading || Object.keys(rowData).length === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Add Row'
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