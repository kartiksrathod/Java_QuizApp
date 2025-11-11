import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Calendar, HelpCircle, RotateCcw, ToggleLeft, ToggleRight } from 'lucide-react';
import Layout from '../shared/Layout';
import { formatDate } from '../../utils/helpers';
import { useTutorial } from '../../context/TutorialContext';
import { TUTORIAL_IDS } from '../../utils/tutorialSteps';

const Profile = () => {
  const { user } = useAuth();
  const { tutorialEnabled, toggleTutorials, resetAllTutorials, startTutorial, isTutorialCompleted } = useTutorial();

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6" data-testid="profile-page">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.full_name || user.username}</h2>
              <p className="text-gray-600">@{user.username}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium text-gray-900">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Account Role</p>
                <p className="font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>

            {user.created_at && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">{formatDate(user.created_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tutorial Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Tutorial & Help Settings
          </h3>
          
          <div className="space-y-4">
            {/* Enable/Disable Tutorials */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable Tutorials</p>
                <p className="text-sm text-gray-600">Show helpful tutorials when visiting pages</p>
              </div>
              <button
                onClick={toggleTutorials}
                className={`p-2 rounded-lg transition-colors ${
                  tutorialEnabled ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
                }`}
                data-testid="toggle-tutorials-button"
              >
                {tutorialEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            {/* Reset All Tutorials */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Reset All Tutorials</p>
                <p className="text-sm text-gray-600">Clear tutorial progress and start over</p>
              </div>
              <button
                onClick={resetAllTutorials}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                data-testid="reset-tutorials-button"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All
              </button>
            </div>

            {/* Restart Specific Tutorials */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Restart Specific Tutorial:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.role === 'user' && (
                  <>
                    <button
                      onClick={() => startTutorial(TUTORIAL_IDS.USER_DASHBOARD)}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      disabled={!tutorialEnabled}
                    >
                      <HelpCircle className="w-4 h-4" />
                      User Dashboard
                    </button>
                    <button
                      onClick={() => startTutorial(TUTORIAL_IDS.QUIZ_INTERFACE)}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      disabled={!tutorialEnabled}
                    >
                      <HelpCircle className="w-4 h-4" />
                      Quiz Interface
                    </button>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => startTutorial(TUTORIAL_IDS.ADMIN_DASHBOARD)}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      disabled={!tutorialEnabled}
                    >
                      <HelpCircle className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => startTutorial(TUTORIAL_IDS.QUESTION_MANAGEMENT)}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      disabled={!tutorialEnabled}
                    >
                      <HelpCircle className="w-4 h-4" />
                      Question Management
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-90 mt-1">Quizzes Taken</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-90 mt-1">Total Points</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">0%</p>
              <p className="text-sm opacity-90 mt-1">Avg Score</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-90 mt-1">Bookmarks</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
