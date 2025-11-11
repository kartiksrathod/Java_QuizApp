import React from 'react';
import { Bookmark, BookOpen } from 'lucide-react';
import Layout from '../shared/Layout';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  // For now, bookmarks is empty - can be implemented in future
  const bookmarks = [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6" data-testid="bookmarks-page">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          <p className="text-gray-600 mt-2">Save questions for later review</p>
        </div>

        {bookmarks.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {bookmarks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Bookmark content */}
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
