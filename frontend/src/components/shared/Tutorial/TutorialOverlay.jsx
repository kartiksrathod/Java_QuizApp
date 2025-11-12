import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTutorial } from '../../../context/TutorialContext';
import { tutorialSteps } from '../../../utils/tutorialSteps';

const TutorialOverlay = () => {
  const { activeTutorial, currentStep, nextStep, previousStep, skipTutorial, completeTutorial } = useTutorial();
  const [targetElement, setTargetElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  const steps = activeTutorial ? tutorialSteps[activeTutorial] : [];
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (!step) return;

    // Find target element
    const findElement = () => {
      const element = document.querySelector(step.target);
      if (element) {
        setTargetElement(element);
        calculatePosition(element);
      } else {
        // Retry after a short delay if element not found
        setTimeout(findElement, 100);
      }
    };

    findElement();
  }, [step, currentStep]);

  const calculatePosition = (element) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const updatedRect = element.getBoundingClientRect();
      let top = updatedRect.top + scrollTop;
      let left = updatedRect.left + scrollLeft;

      // Adjust position based on placement
      if (step.placement === 'bottom') {
        top += updatedRect.height + 20;
        left += updatedRect.width / 2;
      } else if (step.placement === 'top') {
        top -= 20;
        left += updatedRect.width / 2;
      } else if (step.placement === 'right') {
        top += updatedRect.height / 2;
        left += updatedRect.width + 20;
      } else if (step.placement === 'left') {
        top += updatedRect.height / 2;
        left -= 20;
      } else if (step.placement === 'center') {
        top = window.innerHeight / 2 + scrollTop;
        left = window.innerWidth / 2 + scrollLeft;
      }

      setTooltipPosition({ top, left });
    }, 300);
  };

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextStep();
    }
  };

  if (!activeTutorial || !step) return null;

  return (
    <>
      {/* Overlay - non-interactive background */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[998] transition-opacity duration-300" 
        data-testid="tutorial-overlay-backdrop"
        style={{ pointerEvents: 'none' }}
      />

      {/* Highlight Spotlight */}
      {targetElement && step.placement !== 'center' && (
        <div
          className="fixed z-[999] pointer-events-none transition-all duration-300"
          style={{
            top: `${targetElement.getBoundingClientRect().top - 4}px`,
            left: `${targetElement.getBoundingClientRect().left - 4}px`,
            width: `${targetElement.getBoundingClientRect().width + 8}px`,
            height: `${targetElement.getBoundingClientRect().height + 8}px`,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[1000] bg-white rounded-lg shadow-2xl p-6 max-w-md animate-fadeIn"
        style={{
          pointerEvents: 'auto',
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform: step.placement === 'center' ? 'translate(-50%, -50%)' : 
                     step.placement === 'top' ? 'translate(-50%, -100%)' :
                     step.placement === 'bottom' ? 'translate(-50%, 0)' :
                     step.placement === 'left' ? 'translate(-100%, -50%)' :
                     'translate(0, -50%)',
        }}
        data-testid="tutorial-tooltip"
      >
        {/* Close Button */}
        <button
          onClick={skipTutorial}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          data-testid="tutorial-close-button"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="pr-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{step.content}</p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Step {currentStep + 1} of {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={skipTutorial}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            data-testid="tutorial-skip-button"
          >
            Skip Tutorial
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={previousStep}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                data-testid="tutorial-previous-button"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              data-testid="tutorial-next-button"
            >
              {isLastStep ? (
                <>
                  <Check className="w-4 h-4" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorialOverlay;
