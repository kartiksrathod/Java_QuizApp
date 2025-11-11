import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlayCircle, Settings } from 'lucide-react';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import Layout from '../shared/Layout';
import { showToast } from '../shared/Toast';

const QuizSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: searchParams.get('category') || '',
    difficulty: '',
    numQuestions: 10,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStartQuiz = () => {
    if (!formData.category) {
      showToast('Please select a category', 'warning');
      return;
    }

    // Navigate to quiz interface with params
    const params = new URLSearchParams({
      category: formData.category,
      limit: formData.numQuestions,
    });
    if (formData.difficulty) {
      params.append('difficulty', formData.difficulty);
    }
    navigate(`/user/quiz/start?${params.toString()}`);
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
      <div className="max-w-2xl mx-auto space-y-6" data-testid="quiz-selection">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Start a Quiz</h1>
          <p className="text-gray-600 mt-2">Configure your quiz settings below</p>
        </div>

        {/* Quiz Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Settings className="w-5 h-5" />
            Quiz Settings
          </div>

          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="quiz-category-select"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty (Optional)
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="quiz-difficulty-select"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                name="numQuestions"
                value={formData.numQuestions}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="quiz-num-questions-select"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
          </div>

          {/* Quiz Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Quiz Information</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>⏱️ Timer: {formData.numQuestions} minutes (1 min per question)</li>
              <li>📊 Scoring: 1 point per correct answer</li>
              <li>🎯 Pass Rate: 70% or higher</li>
              <li>💡 Instant feedback after submission</li>
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartQuiz}
            disabled={!formData.category}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="start-quiz-button"
          >
            <PlayCircle className="w-5 h-5" />
            Start Quiz
          </button>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-3">📝 Before You Start</h3>
          <ul className="text-sm text-purple-800 space-y-2">
            <li>✓ Ensure you have a stable internet connection</li>
            <li>✓ Find a quiet place to focus</li>
            <li>✓ Read each question carefully</li>
            <li>✓ You can't pause once started</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default QuizSelection;
