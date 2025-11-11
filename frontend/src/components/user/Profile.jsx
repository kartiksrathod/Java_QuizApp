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
