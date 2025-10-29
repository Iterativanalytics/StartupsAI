import React, { useState } from 'react';
import { useVestedInterest, VestedInterestPhase } from '@/contexts/VestedInterestContext';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  Zap, 
  Crown, 
  Star,
  BarChart3,
  Download,
  RefreshCw,
  Trophy,
  Flame,
  Mountain,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Settings,
  Brain,
  Shield,
  ArrowRight,
  Lock,
  Unlock,
  DollarSign,
  Users
} from 'lucide-react';

interface VestedInterestDashboardProps {
  onClose: () => void;
}

const PHASE_ICONS: Record<VestedInterestPhase, React.ReactNode> = {
  'Observer': <Target className="w-6 h-6 text-gray-500" />,
  'Advisor': <BarChart3 className="w-6 h-6 text-blue-500" />,
  'Strategist': <TrendingUp className="w-6 h-6 text-green-500" />,
  'Partner': <Zap className="w-6 h-6 text-purple-500" />,
  'Co-Founder™': <Crown className="w-6 h-6 text-yellow-500" />,
  'Visionary': <Star className="w-6 h-6 text-pink-500" />,
  'Legend': <Trophy className="w-6 h-6 text-red-500" />
};

const RARITY_COLORS = {
  common: 'text-gray-600 bg-gray-100',
  rare: 'text-blue-600 bg-blue-100',
  epic: 'text-purple-600 bg-purple-100',
  legendary: 'text-yellow-600 bg-yellow-100'
};

const VestedInterestDashboard: React.FC<VestedInterestDashboardProps> = ({ onClose }) => {
  const { 
    metrics, 
    milestoneTypes, 
    getPhaseInfo, 
    getProgressToNextPhase, 
    resetScore, 
    exportMetrics,
    getCliffMilestones,
    getRetentionRisk,
    customizeVestingSchedule,
    getKnowledgeMilestones,
    canTransferToVenture,
    transferToVenture,
    getTransferEligibility
  } = useVestedInterest();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'milestones' | 'analytics' | 'cliff' | 'performance' | 'knowledge' | 'transfer' | 'settings'>('overview');
  
  const phaseInfo = getPhaseInfo(metrics.currentScore);
  const progressInfo = getProgressToNextPhase(metrics.currentScore);
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const formatScore = (score: number) => {
    if (score >= 1) return `${score.toFixed(2)}%`;
    return `${(score * 100).toFixed(2)}%`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Crown className="w-6 h-6" />
                VestedInterest™ Dashboard
              </h2>
              <p className="text-purple-100 mt-1">Track your AI partnership journey</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-6 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
              { id: 'milestones', label: 'Milestones', icon: <Target className="w-4 h-4" /> },
              { id: 'cliff', label: 'Cliff Vesting', icon: <Mountain className="w-4 h-4" /> },
              { id: 'performance', label: 'Performance', icon: <Gauge className="w-4 h-4" /> },
              { id: 'knowledge', label: 'Knowledge', icon: <Brain className="w-4 h-4" /> },
              { id: 'transfer', label: 'Transfer', icon: <ArrowRight className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Current Phase */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {PHASE_ICONS[metrics.phase]}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {phaseInfo.phase}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {phaseInfo.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {formatScore(metrics.currentScore)}
                    </div>
                    <div className="text-sm text-gray-500">V-Score</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>Progress to next phase</span>
                    <span>{Math.round(progressInfo.progress * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressInfo.progress * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Milestones</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.milestonesCompleted}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Time Invested</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(metrics.timeInvested)}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.streak} days
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Achievements</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.achievements.length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Achievements
                </h3>
                <span className="text-sm text-gray-500">
                  {metrics.achievements.length} unlocked
                </span>
              </div>
              
              {metrics.achievements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No achievements yet. Complete milestones to unlock achievements!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {metrics.achievements.map((achievement, index) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${
                        RARITY_COLORS[achievement.rarity]
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              RARITY_COLORS[achievement.rarity]
                            }`}>
                              {achievement.rarity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">+{achievement.points}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Milestone Types
              </h3>
              
              <div className="grid gap-4">
                {milestoneTypes.map((type) => (
                  <div
                    key={type.id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {type.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {type.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Base: {type.baseMultiplier}x
                          </span>
                          <span className="text-xs text-gray-500">
                            Context: {type.contextMultiplier}x
                          </span>
                          <span className="text-xs text-gray-500">
                            Total: {(type.baseMultiplier * type.contextMultiplier).toFixed(1)}x
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          +{Math.round((type.baseMultiplier * type.contextMultiplier - 1) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">V-Score boost</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cliff' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cliff Vesting Milestones
                </h3>
                <div className="text-sm text-gray-500">
                  {metrics.cliffMilestones.filter(c => c.achieved).length} of {metrics.cliffMilestones.length} achieved
                </div>
              </div>
              
              <div className="grid gap-4">
                {getCliffMilestones().map((cliff) => (
                  <div
                    key={cliff.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      cliff.achieved
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {cliff.achieved ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <Mountain className="w-6 h-6 text-gray-400" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {cliff.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {cliff.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">
                              Min V-Score: {cliff.minScore}%
                            </span>
                            <span className="text-xs text-gray-500">
                              Cliff Multiplier: {cliff.cliffMultiplier}x
                            </span>
                            {cliff.achievedAt && (
                              <span className="text-xs text-green-600">
                                Achieved: {cliff.achievedAt.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          cliff.achieved ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {cliff.achieved ? '✓' : '⏳'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {cliff.achieved ? 'Achieved' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Metrics
              </h3>
              
              <div className="grid gap-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3 mb-4">
                    <Gauge className="w-6 h-6 text-blue-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Current Performance Score
                    </h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${metrics.performanceScore * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(metrics.performanceScore * 100)}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Based on milestone quality, engagement, and consistency
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Retention Risk Assessment
                    </h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      getRetentionRisk() === 'low' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : getRetentionRisk() === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {getRetentionRisk().toUpperCase()} RISK
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Based on engagement patterns and streak
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Sessions</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metrics.retentionMetrics.totalSessions}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Avg Session Length</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(metrics.retentionMetrics.averageSessionLength)}m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Knowledge Depth Analysis
                </h3>
                <div className="text-sm text-gray-500">
                  Overall: {Math.round(metrics.knowledgeDepth.overallKnowledgeScore * 100)}%
                </div>
              </div>
              
              <div className="grid gap-6">
                {/* Knowledge Categories */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">User Profile</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.knowledgeDepth.userProfileCompleteness * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {Math.round(metrics.knowledgeDepth.userProfileCompleteness * 100)}% complete
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Venture Context</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.knowledgeDepth.ventureContextDepth * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {Math.round(metrics.knowledgeDepth.ventureContextDepth * 100)}% complete
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Business Plan</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.knowledgeDepth.businessPlanFamiliarity * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {Math.round(metrics.knowledgeDepth.businessPlanFamiliarity * 100)}% complete
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Market Understanding</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.knowledgeDepth.marketUnderstanding * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {Math.round(metrics.knowledgeDepth.marketUnderstanding * 100)}% complete
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Financial Model</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.knowledgeDepth.financialModelKnowledge * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {Math.round(metrics.knowledgeDepth.financialModelKnowledge * 100)}% complete
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-pink-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Team Dynamics</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.knowledgeDepth.teamDynamicsAwareness * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {Math.round(metrics.knowledgeDepth.teamDynamicsAwareness * 100)}% complete
                    </div>
                  </div>
                </div>

                {/* Knowledge Milestones */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Knowledge Milestones
                  </h4>
                  <div className="grid gap-3">
                    {getKnowledgeMilestones().map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          milestone.achieved
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {milestone.achieved ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Brain className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {milestone.name}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {milestone.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  Required: {Math.round(milestone.requiredScore * 100)}%
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                  Impact: {milestone.impact}x V-Score
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              milestone.achieved ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {milestone.achieved ? '✓' : '⏳'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transfer' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Co-Agent Transfer Management
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  getTransferEligibility().canTransfer
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {getTransferEligibility().canTransfer ? 'TRANSFER READY' : 'TRANSFER LOCKED'}
                </div>
              </div>
              
              <div className="grid gap-6">
                {/* Transfer Requirements */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Transfer Requirements
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metrics.currentScore >= getTransferEligibility().minimumVScore ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Lock className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          V-Score ≥ {getTransferEligibility().minimumVScore}%
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${
                        metrics.currentScore >= getTransferEligibility().minimumVScore ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metrics.currentScore.toFixed(2)}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metrics.knowledgeDepth.overallKnowledgeScore >= getTransferEligibility().knowledgeRequirement ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Lock className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Knowledge ≥ {Math.round(getTransferEligibility().knowledgeRequirement * 100)}%
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${
                        metrics.knowledgeDepth.overallKnowledgeScore >= getTransferEligibility().knowledgeRequirement ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.round(metrics.knowledgeDepth.overallKnowledgeScore * 100)}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTransferEligibility().transferCooldown >= 30 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Lock className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Cooldown Period (30 days)
                        </span>
                      </div>
                      <div className={`text-sm font-bold ${
                        getTransferEligibility().transferCooldown >= 30 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getTransferEligibility().transferCooldown} days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transfer Protection */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      Transfer Protection Active
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your Co-Agent has deep knowledge of your venture and user profile. 
                    Transferring will result in {Math.round((1 - 0.8) * 100)}% knowledge loss 
                    and require rebuilding context in the new venture.
                  </p>
                </div>

                {/* Transfer History */}
                {getTransferEligibility().transferHistory.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Transfer History
                    </h4>
                    <div className="space-y-2">
                      {getTransferEligibility().transferHistory.map((transfer, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {transfer.fromVenture} → {transfer.toVenture}
                            </span>
                            <div className="text-xs text-gray-500">
                              {transfer.transferDate.toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              V-Score: {transfer.vScoreAtTransfer.toFixed(2)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Knowledge: {Math.round(transfer.knowledgeRetained * 100)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vesting Schedule Settings
              </h3>
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Current Schedule: {metrics.vestingSchedule.persona}
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Base Rate (per minute)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={metrics.vestingSchedule.baseRate}
                      onChange={(e) => customizeVestingSchedule({ baseRate: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Milestone Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={metrics.vestingSchedule.milestoneMultiplier}
                      onChange={(e) => customizeVestingSchedule({ milestoneMultiplier: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Performance Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={metrics.vestingSchedule.performanceMultiplier}
                      onChange={(e) => customizeVestingSchedule({ performanceMultiplier: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Retention Bonus
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={metrics.vestingSchedule.retentionBonus}
                      onChange={(e) => customizeVestingSchedule({ retentionBonus: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> Customizing your vesting schedule affects how quickly your V-Score grows. 
                    Higher values mean faster growth but may reduce the challenge and engagement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Analytics & Insights
              </h3>
              
              <div className="grid gap-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Growth Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Growth</div>
                      <div className="text-2xl font-bold text-green-600">
                        +{formatScore(metrics.totalGrowth)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Max Score</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatScore(metrics.maxScore)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Export Data
                  </h4>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const data = exportMetrics();
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'vested-interest-metrics.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export JSON
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset your VestedInterest™ score? This action cannot be undone.')) {
                          resetScore();
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset Score
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VestedInterestDashboard;
