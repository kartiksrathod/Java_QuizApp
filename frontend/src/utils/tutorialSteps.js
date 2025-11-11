export const TUTORIAL_IDS = {
  USER_DASHBOARD: 'user_dashboard',
  QUIZ_INTERFACE: 'quiz_interface',
  ADMIN_DASHBOARD: 'admin_dashboard',
  QUESTION_MANAGEMENT: 'question_management',
};

export const tutorialSteps = {
  [TUTORIAL_IDS.USER_DASHBOARD]: [
    {
      target: '[data-testid="user-dashboard"]',
      title: 'Welcome to Your Dashboard! 👋',
      content: 'This is your personal dashboard where you can track your progress, view stats, and start quizzes.',
      placement: 'center',
    },
    {
      target: '[data-testid="quizzes-taken-card"]',
      title: 'Your Statistics 📊',
      content: 'Track your quiz performance with these stat cards. Monitor quizzes taken, total points, average score, and bookmarked questions.',
      placement: 'bottom',
    },
    {
      target: '[data-testid="start-quiz-button"]',
      title: 'Start Taking Quizzes 🚀',
      content: 'Click here to begin a quiz. Choose your category and difficulty level to get started!',
      placement: 'bottom',
    },
    {
      target: '[data-testid="category-card"]',
      title: 'Browse Topics 📚',
      content: 'Explore available topics and select one to practice. Each topic contains curated questions to help you learn.',
      placement: 'top',
    },
  ],
  [TUTORIAL_IDS.QUIZ_INTERFACE]: [
    {
      target: '[data-testid="quiz-interface"]',
      title: 'Quiz Interface 📝',
      content: 'Welcome to the quiz! Read each question carefully and select your answer.',
      placement: 'center',
    },
    {
      target: '.bg-blue-100.text-blue-700',
      title: 'Quiz Timer ⏱️',
      content: 'Keep an eye on the timer! You have 1 minute per question. The timer turns red in the last minute.',
      placement: 'bottom',
    },
    {
      target: '[data-testid="quiz-option-0"]',
      title: 'Select Answers ✅',
      content: 'Click on an option to select your answer. You can change your selection anytime before submitting.',
      placement: 'right',
    },
    {
      target: '[data-testid="quiz-next-button"]',
      title: 'Navigate Questions ➡️',
      content: 'Use Next/Previous buttons to move between questions. You can also use the question navigator below.',
      placement: 'top',
    },
  ],
  [TUTORIAL_IDS.ADMIN_DASHBOARD]: [
    {
      target: '[data-testid="admin-dashboard"]',
      title: 'Admin Dashboard 👨‍💼',
      content: 'Welcome to the admin panel! Manage questions, upload bulk data, and view analytics.',
      placement: 'center',
    },
    {
      target: '[data-testid="total-questions-card"]',
      title: 'System Statistics 📈',
      content: 'Monitor your question bank with these overview cards showing total questions, categories, and activity.',
      placement: 'bottom',
    },
    {
      target: '[data-testid="manage-questions-button"]',
      title: 'Question Management 📝',
      content: 'Click here to view, edit, delete, or add new questions to your database.',
      placement: 'bottom',
    },
    {
      target: '.bg-gradient-to-r',
      title: 'Quick Actions ⚡',
      content: 'Use these shortcuts to quickly add questions, upload bulk data, export PDFs, or browse all questions.',
      placement: 'top',
    },
  ],
  [TUTORIAL_IDS.QUESTION_MANAGEMENT]: [
    {
      target: '[data-testid="add-question-button"]',
      title: 'Add New Question ➕',
      content: 'Click here to add a new question manually with options, correct answer, and explanation.',
      placement: 'bottom',
    },
    {
      target: '[data-testid="bulk-upload-button"]',
      title: 'Bulk Upload 📤',
      content: 'Upload multiple questions at once using CSV or JSON format. Download sample templates for reference.',
      placement: 'bottom',
    },
    {
      target: '[data-testid="export-pdf-button"]',
      title: 'Generate PDF 📄',
      content: 'Create topic-wise question papers in PDF format for printing or distribution.',
      placement: 'bottom',
    },
  ],
};
