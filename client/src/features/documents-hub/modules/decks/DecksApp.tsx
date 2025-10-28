import React, { useState, useCallback } from 'react';
import FastTrackMode from './pages/FastTrackMode';
import ValidatedMode from './pages/ValidatedMode';
import ModeToggle from './components/ModeToggle';
import { Mode, Assumption, ToastType } from '../../types';

interface DecksAppProps {
  showToast: (message: string, type: ToastType) => void;
}

const DecksApp: React.FC<DecksAppProps> = ({ showToast }) => {
  const [mode, setMode] = useState<Mode>('fast-track');
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [deckContent, setDeckContent] = useState<string | null>(null);

  const handleDeckGeneration = useCallback((newDeckContent: string, newAssumptions: Assumption[]) => {
    setDeckContent(newDeckContent);
    setAssumptions(newAssumptions);
    setMode('validated');
  }, []);

  const handleClearAssumptions = useCallback(() => {
    setAssumptions([]);
    setDeckContent(null);
  }, []);

  const handleSetMode = (newMode: Mode) => {
    setMode(newMode);
  };

  return (
    <div>
        <div className="flex justify-center mb-8">
            <ModeToggle mode={mode} setMode={handleSetMode} />
        </div>
      
        {mode === 'fast-track' ? (
          <FastTrackMode onGenerateDeck={handleDeckGeneration} showToast={showToast} />
        ) : (
          <ValidatedMode 
            deckContent={deckContent}
            assumptions={assumptions} 
            onClearAssumptions={handleClearAssumptions} 
          />
        )}
    </div>
  );
};

export default DecksApp;