import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  Edit, 
  Trash2,
  X
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import Layout from '../shared/Layout';
import { showToast } from '../shared/Toast';
import AddQuestionForm from './AddQuestionForm';
import EditQuestionForm from './EditQuestionForm';
import BulkUploadDialog from './BulkUploadDialog';
import PDFGeneratorDialog from './PDFGeneratorDialog';
import { downloadFile } from '../../utils/helpers';

const QuestionManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showPDFGenerator, setShowPDFGenerator] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchCategories();

    // Handle URL params for quick actions
    const action = searchParams.get('action');
    if (action === 'add') setShowAddForm(true);
    if (action === 'upload') setShowBulkUpload(true);
    if (action === 'export') setShowPDFGenerator(true);
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllQuestions();
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      showToast('Failed to load questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty);
    }

    setFilteredQuestions(filtered);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await adminAPI.deleteQuestion(id);
      showToast('Question deleted successfully', 'success');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      showToast('Failed to delete question', 'error');
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowEditForm(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6" data-testid="question-management">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Question Management</h1>
            <p className="text-gray-600 mt-1">
              {filteredQuestions.length} questions found
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              data-testid="add-question-button"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
            <button
              onClick={() => setShowBulkUpload(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              data-testid="bulk-upload-button"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>
            <button
              onClick={() => setShowPDFGenerator(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              data-testid="export-pdf-button"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="search-questions-input"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="filter-category-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="filter-difficulty-select"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {(searchTerm || selectedCategory || selectedDifficulty) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Clear filters"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="questions-table">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-50 transition-colors" data-testid="question-row">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {question.question}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">by {question.created_by}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {question.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            question.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : question.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{question.answer}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="inline-flex items-center p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                          data-testid="edit-question-button"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="inline-flex items-center p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                          data-testid="delete-question-button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No questions found. Try adjusting your filters or add new questions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddForm && (
        <AddQuestionForm
          onClose={() => {
            setShowAddForm(false);
            setSearchParams({});
          }}
          onSuccess={() => {
            fetchQuestions();
            setShowAddForm(false);
            setSearchParams({});
          }}
        />
      )}

      {showEditForm && editingQuestion && (
        <EditQuestionForm
          question={editingQuestion}
          onClose={() => {
            setShowEditForm(false);
            setEditingQuestion(null);
          }}
          onSuccess={() => {
            fetchQuestions();
            setShowEditForm(false);
            setEditingQuestion(null);
          }}
        />
      )}

      {showBulkUpload && (
        <BulkUploadDialog
          onClose={() => {
            setShowBulkUpload(false);
            setSearchParams({});
          }}
          onSuccess={() => {
            fetchQuestions();
            setShowBulkUpload(false);
            setSearchParams({});
          }}
        />
      )}

      {showPDFGenerator && (
        <PDFGeneratorDialog
          categories={categories}
          onClose={() => {
            setShowPDFGenerator(false);
            setSearchParams({});
          }}
        />
      )}
    </Layout>
  );
};

export default QuestionManagement;
