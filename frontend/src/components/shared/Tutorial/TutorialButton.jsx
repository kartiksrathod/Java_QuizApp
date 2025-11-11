import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useTutorial } from '../../../context/TutorialContext';

const TutorialButton = ({ tutorialId, className = '' }) => {
  const { startTutorial, tutorialEnabled } = useTutorial();

  if (!tutorialEnabled) return null;

  return (
    <button
      onClick={() => startTutorial(tutorialId)}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
      data-testid="tutorial-start-button"
      title="Show tutorial"
    >
      <HelpCircle className="w-4 h-4" />
      <span className="hidden sm:inline">Show Tutorial</span>
    </button>
  );
};

export default TutorialButton;
