import React, { useState } from 'react';
import { X, Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { showToast } from '../shared/Toast';

const BulkUploadDialog = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (fileType !== 'json' && fileType !== 'csv') {
        showToast('Please upload a JSON or CSV file', 'error');
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a file', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await adminAPI.bulkUpload(file);
      setUploadResult(response.data);
      
      if (response.data.success > 0) {
        showToast(`Successfully uploaded ${response.data.success} questions`, 'success');
        if (response.data.failed === 0) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        showToast('No questions were uploaded', 'error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showToast(error.response?.data?.detail || 'Failed to upload file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleJSON = () => {
    const sample = [
      {
        question: "What is polymorphism in Java?",
        options: ["Method overloading", "Method overriding", "Both A and B", "None of the above"],
        answer: "Both A and B",
        category: "OOP Concepts",
        difficulty: "medium",
        explanation: "Polymorphism includes both compile-time (overloading) and runtime (overriding) polymorphism"
      },
      {
        question: "Which keyword is used to inherit a class in Java?",
        options: ["extends", "implements", "inherits", "super"],
        answer: "extends",
        category: "Keywords",
        difficulty: "easy",
        explanation: "The extends keyword is used for class inheritance in Java"
      }
    ];
    
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showToast('Sample JSON downloaded', 'success');
  };

  const downloadSampleCSV = () => {
    const csvContent = `question,options,answer,category,difficulty,explanation
"What is polymorphism in Java?","[\"Method overloading\",\"Method overriding\",\"Both A and B\",\"None of the above\"]","Both A and B","OOP Concepts","medium","Polymorphism includes both compile-time and runtime polymorphism"
"Which keyword is used to inherit a class?","[\"extends\",\"implements\",\"inherits\",\"super\"]","extends","Keywords","easy","The extends keyword is used for class inheritance"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showToast('Sample CSV downloaded', 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-2 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" data-testid="bulk-upload-dialog">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bulk Upload Questions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Sample files */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Download Sample Templates
            </h3>
            <div className="flex gap-3">
              <button
                onClick={downloadSampleJSON}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                data-testid="download-sample-json-button"
              >
                <Download className="w-4 h-4" />
                Sample JSON
              </button>
              <button
                onClick={downloadSampleCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                data-testid="download-sample-csv-button"
              >
                <Download className="w-4 h-4" />
                Sample CSV
              </button>
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (JSON or CSV)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="bulk-upload-input"
                data-testid="bulk-upload-file-input"
              />
              <label
                htmlFor="bulk-upload-input"
                className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose File
              </label>
              {file && (
                <p className="mt-3 text-sm text-gray-600">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Upload result */}
          {uploadResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Upload Results</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{uploadResult.success}</p>
                  <p className="text-xs text-gray-600">Successful</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{uploadResult.failed}</p>
                  <p className="text-xs text-gray-600">Failed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{uploadResult.total}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Errors:
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded p-3 max-h-32 overflow-y-auto">
                    {uploadResult.errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-700">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Format info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">File Format Requirements</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>question</strong>: Text of the question (required)</li>
              <li>• <strong>options</strong>: Array of answer options (required, min 2)</li>
              <li>• <strong>answer</strong>: Correct answer from options (required)</li>
              <li>• <strong>category</strong>: Question category (required)</li>
              <li>• <strong>difficulty</strong>: easy, medium, or hard (optional, default: medium)</li>
              <li>• <strong>explanation</strong>: Answer explanation (optional)</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="bulk-upload-submit-button"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Questions
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadDialog;
