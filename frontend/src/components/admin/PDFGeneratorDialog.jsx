import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { showToast } from '../shared/Toast';
import { downloadFile } from '../../utils/helpers';

const PDFGeneratorDialog = ({ categories, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.exportPDF(selectedCategory);
      
      // Download the PDF
      const filename = `question_paper_${
        selectedCategory || 'all'
      }_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadFile(response.data, filename);
      
      showToast('PDF generated successfully', 'success');
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast(error.response?.data?.detail || 'Failed to generate PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" data-testid="pdf-generator-dialog">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Generate Question Paper</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category (Optional)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="pdf-category-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Leave empty to include all questions from all categories
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">PDF Features</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Header with Name, Roll No, Date fields</li>
              <li>• Questions grouped by topic/category</li>
              <li>• Auto-numbered questions per category</li>
              <li>• Clean format for printing</li>
              <li>• No answers included (exam-ready)</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="pdf-generate-button"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFGeneratorDialog;
