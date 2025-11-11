import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  Award,
  PlayCircle,
  Clock,
  Target
} from 'lucide-react';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import Layout from '../shared/Layout';
import { showToast } from '../shared/Toast';
import { useTutorial } from '../../context/TutorialContext';
import { TUTORIAL_IDS } from '../../utils/tutorialSteps';
import TutorialButton from '../shared/Tutorial/TutorialButton';

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    quizzesTaken: 0,
    totalScore: 0,
    avgScore: 0,
    bookmarked: 0,
  });
  const { startTutorial, isTutorialCompleted, tutorialEnabled } = useTutorial();

  useEffect(() => {
    fetchCategories();
    
    // Auto-start tutorial on first visit
    const hasSeenDashboard = localStorage.getItem('hasSeenUserDashboard');
    if (!hasSeenDashboard && tutorialEnabled && !isTutorialCompleted(TUTORIAL_IDS.USER_DASHBOARD)) {
      setTimeout(() => {
        startTutorial(TUTORIAL_IDS.USER_DASHBOARD);
        localStorage.setItem('hasSeenUserDashboard', 'true');
      }, 1000);
    }
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
      <div className="space-y-6" data-testid="user-dashboard">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Java Quiz</h1>
          <p className="text-gray-600 mt-2">Test your Java knowledge and improve your skills</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="quizzes-taken-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quizzes Taken</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.quizzesTaken}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="total-score-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalScore}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="avg-score-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgScore}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="bookmarked-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bookmarked</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bookmarked}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Quiz */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <PlayCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ready to Test Your Knowledge?</h2>
            <p className="text-blue-100 mb-6">
              Choose a category and difficulty level to start a quiz
            </p>
            <Link
              to="/user/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              data-testid="start-quiz-button"
            >
              <PlayCircle className="w-5 h-5" />
              Start Quiz Now
            </Link>
          </div>
        </div>

        {/* Available Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Available Topics</h3>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/user/quiz?category=${encodeURIComponent(category)}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  data-testid="category-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category}</p>
                      <p className="text-xs text-gray-500">Practice questions</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No categories available yet</p>
          )}
        </div>

        {/* Learning Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Quiz Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900 mb-2">💡 Take Your Time</p>
              <p className="text-sm text-blue-800">
                Each quiz has 1 minute per question. Read carefully before answering.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900 mb-2">🎯 Practice Regularly</p>
              <p className="text-sm text-green-800">
                Consistent practice improves retention and understanding of concepts.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-900 mb-2">📚 Review Explanations</p>
              <p className="text-sm text-purple-800">
                After each quiz, review the explanations to learn from mistakes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
