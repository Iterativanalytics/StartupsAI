import React, { useState } from 'react';
import { useVestedInterest } from '@/contexts/VestedInterestContext';
import { Goal } from '@/types-hub';
import { 
  Target, 
  PlusCircle, 
  Award, 
  Zap, 
  DollarSign, 
  Users, 
  TrendingUp,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface EnhancedMilestoneSelectorProps {
  onMilestoneComplete: (milestone: Goal, type: string) => void;
}

const MILESTONE_ICONS = {
  product: <Rocket className="w-5 h-5 text-blue-500" />,
  business: <Target className="w-5 h-5 text-green-500" />,
  financial: <DollarSign className="w-5 h-5 text-yellow-500" />,
  team: <Users className="w-5 h-5 text-purple-500" />,
  market: <TrendingUp className="w-5 h-5 text-orange-500" />,
  innovation: <Lightbulb className="w-5 h-5 text-pink-500" />
};

const EnhancedMilestoneSelector: React.FC<EnhancedMilestoneSelectorProps> = ({ onMilestoneComplete }) => {
  const { milestoneTypes } = useVestedInterest();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');

  const handleMilestoneComplete = (milestone: Goal) => {
    if (selectedType) {
      onMilestoneComplete(milestone, selectedType);
      setSelectedType('');
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    return MILESTONE_ICONS[category as keyof typeof MILESTONE_ICONS] || <Award className="w-5 h-5" />;
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 3.0) return 'text-red-600 bg-red-100';
    if (multiplier >= 2.0) return 'text-orange-600 bg-orange-100';
    if (multiplier >= 1.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-4">
      {/* Quick Milestone Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Zap className="w-5 h-5" />
        <span className="font-semibold">Complete Milestone</span>
        <Award className="w-4 h-4" />
      </button>

      {/* Milestone Type Selector */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Milestone Type
          </h3>
          
          <div className="grid gap-3">
            {milestoneTypes.map((type) => {
              const totalMultiplier = type.baseMultiplier * type.contextMultiplier;
              const boostPercentage = Math.round((totalMultiplier - 1) * 100);
              
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    selectedType === type.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(type.category)}
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {type.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {type.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Base: {type.baseMultiplier}x
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            Context: {type.contextMultiplier}x
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getMultiplierColor(totalMultiplier)} px-2 py-1 rounded-full`}>
                        +{boostPercentage}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        V-Score boost
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedType && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900 dark:text-purple-100">
                  Milestone Type Selected
                </span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                When you mark a goal as complete, it will be treated as a{' '}
                <strong>{milestoneTypes.find(t => t.id === selectedType)?.name}</strong> milestone
                and will boost your VestedInterest™ by{' '}
                <strong>
                  +{Math.round(((milestoneTypes.find(t => t.id === selectedType)?.baseMultiplier || 1) * 
                  (milestoneTypes.find(t => t.id === selectedType)?.contextMultiplier || 1) - 1) * 100)}%
                </strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedMilestoneSelector;
