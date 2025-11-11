import React, { useState, useEffect } from 'react';
import { Bookmark, BookOpen, Trash2, BookmarkCheck } from 'lucide-react';
import Layout from '../shared/Layout';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import { showToast } from '../shared/Toast';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getBookmarks();
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      showToast('Failed to load bookmarks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (questionId) => {
    if (!window.confirm('Remove this question from bookmarks?')) {
      return;
    }

    try {
      await userAPI.removeBookmark(questionId);
      showToast('Bookmark removed', 'success');
      fetchBookmarks();
    } catch (error) {
      console.error('Error removing bookmark:', error);
      showToast('Failed to remove bookmark', 'error');
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
      <div className="max-w-4xl mx-auto space-y-6" data-testid="bookmarks-page">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookmarkCheck className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          </div>
          <p className="text-gray-600 mt-2">
            {bookmarks.length > 0 
              ? `You have ${bookmarks.length} bookmarked question${bookmarks.length !== 1 ? 's' : ''}`
              : 'Save questions for later review'
            }
          </p>
        </div>

        {bookmarks.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="bookmark-item"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-3">
                        {bookmark.question.question}
                      </p>
                      
                      {/* Options */}
                      <div className="space-y-2 mb-3">
                        {bookmark.question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded text-sm ${
                              option === bookmark.question.answer
                                ? 'bg-green-50 border border-green-200 text-green-800 font-medium'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {option}
                            {option === bookmark.question.answer && (
                              <span className="ml-2 text-xs">(Correct Answer)</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      {bookmark.question.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Explanation:</p>
                          <p className="text-sm text-blue-800">{bookmark.question.explanation}</p>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-3 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {bookmark.question.category}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            bookmark.question.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : bookmark.question.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {bookmark.question.difficulty}
                        </span>
                        <span className="text-gray-500">
                          Saved {new Date(bookmark.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.question_id)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove bookmark"
                      data-testid="remove-bookmark-button"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Bookmark className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookmarks Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start taking quizzes and bookmark questions you want to review later.
            </p>
            <Link
              to="/user/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              data-testid="take-quiz-link"
            >
              <BookOpen className="w-5 h-5" />
              Take a Quiz
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookmarks;
