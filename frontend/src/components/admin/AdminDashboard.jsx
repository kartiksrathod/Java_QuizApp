import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  FolderOpen, 
  TrendingUp,
  Upload,
  Download,
  Plus,
  BarChart3 
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statsAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import Layout from '../shared/Layout';
import { showToast } from '../shared/Toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast('Failed to load dashboard stats', 'error');
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

  // Prepare chart data
  const difficultyData = stats?.difficultyBreakdown ? 
    Object.entries(stats.difficultyBreakdown).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value
    })) : [];

  const categoryData = stats?.categoryBreakdown ? 
    Object.entries(stats.categoryBreakdown)
      .slice(0, 6)
      .map(([key, value]) => ({
        name: key,
        questions: value
      })) : [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <Layout>
      <div className="space-y-6" data-testid="admin-dashboard">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage questions and view statistics</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/questions"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              data-testid="manage-questions-button"
            >
              <FileText className="w-4 h-4" />
              Manage Questions
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover" data-testid="total-questions-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalQuestions || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Questions in database</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover" data-testid="total-categories-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalCategories || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FolderOpen className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Question categories</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover" data-testid="question-activity-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.recentQuestions?.length || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Recently added</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Difficulty Distribution
            </h3>
            {difficultyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-10">No data available</p>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Categories
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="questions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-10">No data available</p>
            )}
          </div>
        </div>

        {/* Recent Questions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Questions</h3>
          {stats?.recentQuestions && stats.recentQuestions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentQuestions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="recent-question-item"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{question.question}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {question.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {question.difficulty}
                        </span>
                        <span>by {question.created_by}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">No recent questions</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/questions?action=add"
              className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Plus className="w-6 h-6" />
              <div>
                <p className="font-medium">Add Question</p>
                <p className="text-sm opacity-90">Create new question</p>
              </div>
            </Link>
            <Link
              to="/admin/questions?action=upload"
              className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Upload className="w-6 h-6" />
              <div>
                <p className="font-medium">Bulk Upload</p>
                <p className="text-sm opacity-90">Upload CSV/JSON</p>
              </div>
            </Link>
            <Link
              to="/admin/questions?action=export"
              className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Download className="w-6 h-6" />
              <div>
                <p className="font-medium">Export PDF</p>
                <p className="text-sm opacity-90">Generate papers</p>
              </div>
            </Link>
            <Link
              to="/admin/questions"
              className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <FileText className="w-6 h-6" />
              <div>
                <p className="font-medium">View All</p>
                <p className="text-sm opacity-90">Browse questions</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
