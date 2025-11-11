import React, { createContext, useContext, useState, useEffect } from 'react';

const TutorialContext = createContext();

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};

export const TutorialProvider = ({ children }) => {
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [tutorialEnabled, setTutorialEnabled] = useState(true);

  useEffect(() => {
    // Load tutorial state from localStorage
    const completed = JSON.parse(localStorage.getItem('completedTutorials') || '[]');
    const enabled = JSON.parse(localStorage.getItem('tutorialEnabled') || 'true');
    setCompletedTutorials(completed);
    setTutorialEnabled(enabled);
  }, []);

  const startTutorial = (tutorialId) => {
    if (!tutorialEnabled) return;
    setActiveTutorial(tutorialId);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const skipTutorial = () => {
    if (activeTutorial) {
      const updated = [...completedTutorials, activeTutorial];
      setCompletedTutorials(updated);
      localStorage.setItem('completedTutorials', JSON.stringify(updated));
    }
    setActiveTutorial(null);
    setCurrentStep(0);
  };

  const completeTutorial = () => {
    if (activeTutorial && !completedTutorials.includes(activeTutorial)) {
      const updated = [...completedTutorials, activeTutorial];
      setCompletedTutorials(updated);
      localStorage.setItem('completedTutorials', JSON.stringify(updated));
    }
    setActiveTutorial(null);
    setCurrentStep(0);
  };

  const resetTutorial = (tutorialId) => {
    const updated = completedTutorials.filter((id) => id !== tutorialId);
    setCompletedTutorials(updated);
    localStorage.setItem('completedTutorials', JSON.stringify(updated));
  };

  const resetAllTutorials = () => {
    setCompletedTutorials([]);
    localStorage.setItem('completedTutorials', JSON.stringify([]));
  };

  const toggleTutorials = () => {
    const newState = !tutorialEnabled;
    setTutorialEnabled(newState);
    localStorage.setItem('tutorialEnabled', JSON.stringify(newState));
    if (!newState) {
      setActiveTutorial(null);
      setCurrentStep(0);
    }
  };

  const isTutorialCompleted = (tutorialId) => {
    return completedTutorials.includes(tutorialId);
  };

  const value = {
    activeTutorial,
    currentStep,
    completedTutorials,
    tutorialEnabled,
    startTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    resetTutorial,
    resetAllTutorials,
    toggleTutorials,
    isTutorialCompleted,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};
