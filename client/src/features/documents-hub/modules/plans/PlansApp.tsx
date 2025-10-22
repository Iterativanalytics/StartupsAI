import React, { useState } from 'react';
import { Mode, Assumption, ToastType } from '../../types';
import ValidatedMode from './pages/ValidatedMode';
import FastTrackMode from './pages/FastTrackMode';
import ModeToggle from './components/ModeToggle';
import { PLAN_MOCK_ASSUMPTIONS } from './constants';

interface PlansAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const PlansApp: React.FC<PlansAppProps> = ({ addToast }) => {
  const [mode, setMode] = useState<Mode>('validated');
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  
  const handlePlanGeneration = () => {
    addToast('Assumptions generated successfully!', 'success');
    setAssumptions(PLAN_MOCK_ASSUMPTIONS);
    setMode('validated');
  };

  const handleClearAssumptions = () => {
    addToast('Assumption dashboard cleared.', 'info');
    setAssumptions([]);
  };

  return (
    <div>
        <div className="flex justify-center mb-8">
            <ModeToggle mode={mode} setMode={setMode} />
        </div>
        
        {mode === 'validated' ? (
          <ValidatedMode 
            assumptions={assumptions}
            onClearAssumptions={handleClearAssumptions}
          />
        ) : (
          <FastTrackMode onGeneratePlan={handlePlanGeneration} addToast={addToast} />
        )}
    </div>
  );
}

export default PlansApp;