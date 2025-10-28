import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS } from './constants';
import { ArrowRight } from 'lucide-react';

interface AssessmentRunnerProps {
  onComplete: (answers: Record<string, number>) => void;
}

const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm font-semibold text-purple-700">{currentQuestion.category}</span>
          <span className="text-sm font-medium text-slate-500">{currentQuestionIndex + 1} / {totalQuestions}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
          <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="bg-slate-50 p-8 rounded-lg text-center border border-slate-200 min-h-[150px] flex items-center justify-center">
          <p className="text-xl font-semibold text-slate-800">{currentQuestion.text}</p>
        </div>

        <div className="mt-6">
          <p className="text-sm text-center text-slate-500 mb-3">Rate your agreement with the statement above:</p>
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-slate-500 text-center">Strongly<br/>Disagree</span>
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center font-bold text-lg
                  ${answers[currentQuestion.id] === value 
                    ? 'bg-purple-600 border-purple-600 text-white scale-110' 
                    : 'bg-white border-slate-300 text-slate-600 hover:border-purple-400'
                  }`}
              >
                {value}
              </button>
            ))}
            <span className="text-xs text-slate-500 text-center">Strongly<br/>Agree</span>
          </div>
        </div>

        {currentQuestionIndex === totalQuestions - 1 && (
             <div className="text-center mt-8">
                <button 
                    onClick={() => onComplete(answers)}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg"
                >
                    Complete Assessment
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentRunner;
