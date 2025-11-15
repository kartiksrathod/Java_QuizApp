import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, XCircle, CheckCircle2, Clock, RotateCw, Home, Bookmark, BookmarkCheck } from 'lucide-react';
import Layout from '../shared/Layout';
import { userAPI } from '../../services/api';
import { showToast } from '../shared/Toast';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers, score, timeSpent } = location.state || {};
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState({});

  useEffect(() => {
    if (questions) {
      // Check bookmark status for all questions
      checkAllBookmarks();
    }
  }, [questions]);

  const checkAllBookmarks = async () => {
    try {
      const bookmarkStatuses = await Promise.all(
        questions.map(q => userAPI.checkBookmarkStatus(q.id))
      );
      const bookmarked = new Set(
        questions
          .filter((_, idx) => bookmarkStatuses[idx].data.is_bookmarked)
          .map(q => q.id)
      );
      setBookmarkedQuestions(bookmarked);
    } catch (error) {
      console.error('Error checking bookmarks:', error);
    }
  };

  const handleToggleBookmark = async (questionId) => {
    const isBookmarked = bookmarkedQuestions.has(questionId);
    
    setBookmarkLoading(prev => ({ ...prev, [questionId]: true }));
    
    try {
      if (isBookmarked) {
        await userAPI.removeBookmark(questionId);
        setBookmarkedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
        showToast('Bookmark removed', 'success');
      } else {
        await userAPI.addBookmark(questionId);
        setBookmarkedQuestions(prev => new Set([...prev, questionId]));
        showToast('Question bookmarked', 'success');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      showToast(error.response?.data?.detail || 'Failed to update bookmark', 'error');
    } finally {
      setBookmarkLoading(prev => ({ ...prev, [questionId]: false }));
    }
  };

  if (!questions || !score) {
    navigate('/user/quiz');
    return null;
  }

  const isPassed = score.percentage >= 70;
  const timeSpentMinutes = Math.floor(timeSpent / 60);
  const timeSpentSeconds = timeSpent % 60;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6" data-testid="quiz-results">
        {/* Results Header */}
        <div
          className={`rounded-xl shadow-lg p-6 xs:p-8 text-white text-center ${
            isPassed
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-red-500 to-rose-600'
          }`}
        >
          <div className="flex justify-center mb-4">
            {isPassed ? (
              <Trophy className="w-16 h-16 xs:w-20 xs:h-20" />
            ) : (
              <XCircle className="w-16 h-16 xs:w-20 xs:h-20" />
            )}
          </div>
          <h1 className="text-2xl xs:text-3xl font-bold mb-2">
            {isPassed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}
          </h1>
          <p className="text-base xs:text-lg opacity-90">
            {isPassed
              ? 'You passed the quiz with flying colors!'
              : 'Don\'t worry, practice makes perfect!'}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg xs:text-xl font-bold text-gray-900 mb-4">Your Score</h2>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 xs:p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl xs:text-4xl font-bold text-blue-600">{score.percentage}%</p>
              <p className="text-xs xs:text-sm text-gray-600 mt-1">Score</p>
            </div>
            <div className="text-center p-3 xs:p-4 bg-green-50 rounded-lg">
              <p className="text-3xl xs:text-4xl font-bold text-green-600">
                {score.correct}/{score.total}
              </p>
              <p className="text-xs xs:text-sm text-gray-600 mt-1">Correct Answers</p>
            </div>
            <div className="text-center p-3 xs:p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl xs:text-4xl font-bold text-purple-600">
                {timeSpentMinutes}:{timeSpentSeconds.toString().padStart(2, '0')}
              </p>
              <p className="text-xs xs:text-sm text-gray-600 mt-1">Time Spent</p>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Results</h2>
          <div className="space-y-4">
            {questions.map((question, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === question.answer;

              return (
                <div
                  key={idx}
                  className={`p-4 border-2 rounded-lg ${
                    isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                  data-testid="result-question-item"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        Q{idx + 1}. {question.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Your Answer:</span>{' '}
                          <span
                            className={isCorrect ? 'text-green-700' : 'text-red-700'}
                          >
                            {userAnswer || 'Not answered'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="font-medium">Correct Answer:</span>{' '}
                            <span className="text-green-700">{question.answer}</span>
                          </p>
                        )}
                        {question.explanation && (
                          <p className="mt-2 text-gray-600">
                            <span className="font-medium">Explanation:</span>{' '}
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleBookmark(question.id)}
                      disabled={bookmarkLoading[question.id]}
                      className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                        bookmarkedQuestions.has(question.id)
                          ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                      } disabled:opacity-50`}
                      title={bookmarkedQuestions.has(question.id) ? 'Remove bookmark' : 'Bookmark question'}
                      data-testid="bookmark-question-button"
                    >
                      {bookmarkedQuestions.has(question.id) ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <Link
            to="/user/quiz"
            className="flex items-center justify-center gap-2 px-4 xs:px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm xs:text-base"
            data-testid="take-another-quiz-button"
          >
            <RotateCw className="w-4 h-4 xs:w-5 xs:h-5" />
            <span className="xs:inline">Take Another Quiz</span>
          </Link>
          <Link
            to="/user/bookmarks"
            className="flex items-center justify-center gap-2 px-4 xs:px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-sm xs:text-base"
            data-testid="view-bookmarks-button"
          >
            <BookmarkCheck className="w-4 h-4 xs:w-5 xs:h-5" />
            <span className="xs:inline">View Bookmarks</span>
          </Link>
          <Link
            to="/user/dashboard"
            className="flex items-center justify-center gap-2 px-4 xs:px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm xs:text-base xs:col-span-2 sm:col-span-1"
            data-testid="back-to-dashboard-button"
          >
            <Home className="w-4 h-4 xs:w-5 xs:h-5" />
            <span className="xs:inline">Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default QuizResults;
