import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  Clock, 
  Target, 
  Users, 
  Lightbulb, 
  TestTube, 
  BarChart3,
  TrendingUp,
  FileText,
  Download,
  Share2,
  Save
} from 'lucide-react';

interface DesignThinkingToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: {
    name: string;
    description: string;
    outputs: string[];
  } | null;
  onComplete: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

interface ToolOutput {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'canvas' | 'chart' | 'list';
  completed: boolean;
  createdAt: Date;
}

const DesignThinkingToolModal: React.FC<DesignThinkingToolModalProps> = ({
  isOpen,
  onClose,
  tool,
  onComplete,
  addToast
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [toolData, setToolData] = useState<any>({});
  const [outputs, setOutputs] = useState<ToolOutput[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (tool && isOpen) {
      setActiveStep(0);
      setToolData({});
      setOutputs([]);
    }
  }, [tool, isOpen]);

  const getToolSteps = (toolName: string) => {
    switch (toolName) {
      case 'Empathy Map Builder':
        return [
          { title: 'Select User Type', description: 'Choose the user persona to map' },
          { title: 'Think & Feel', description: 'What do they think and feel about the problem?' },
          { title: 'See', description: 'What do they see in their environment?' },
          { title: 'Say & Do', description: 'What do they say and do?' },
          { title: 'Hear', description: 'What do they hear from others?' },
          { title: 'Pain Points', description: 'What frustrates them?' },
          { title: 'Gains', description: 'What would make their life better?' }
        ];
      case 'User Journey Mapper':
        return [
          { title: 'Define Journey', description: 'Set the journey scope and goals' },
          { title: 'Map Touchpoints', description: 'Identify all user touchpoints' },
          { title: 'Emotion Curve', description: 'Map emotional highs and lows' },
          { title: 'Pain Points', description: 'Identify pain points at each stage' },
          { title: 'Opportunities', description: 'Find improvement opportunities' }
        ];
      case 'POV Statement Builder':
        return [
          { title: 'User Definition', description: 'Define your target user' },
          { title: 'Need Identification', description: 'What do they need to accomplish?' },
          { title: 'Insight Discovery', description: 'Why does this matter to them?' },
          { title: 'POV Statement', description: 'Craft your Point of View statement' }
        ];
      case 'HMW Question Generator':
        return [
          { title: 'Problem Analysis', description: 'Analyze the core problem' },
          { title: 'Generate Questions', description: 'Create How Might We questions' },
          { title: 'Prioritize Questions', description: 'Rank questions by potential impact' },
          { title: 'Refine Questions', description: 'Polish and finalize questions' }
        ];
      case 'Brainstorming Canvas':
        return [
          { title: 'Set Challenge', description: 'Define the challenge to solve' },
          { title: 'Generate Ideas', description: 'Use brainstorming techniques' },
          { title: 'Group Ideas', description: 'Categorize similar ideas' },
          { title: 'Vote & Prioritize', description: 'Select the best ideas' }
        ];
      case 'Assumption Mapper':
        return [
          { title: 'List Assumptions', description: 'Identify all assumptions' },
          { title: 'Risk Assessment', description: 'Rate assumption risk levels' },
          { title: 'Test Planning', description: 'Plan how to test each assumption' },
          { title: 'Priority Matrix', description: 'Prioritize by risk and impact' }
        ];
      default:
        return [
          { title: 'Setup', description: 'Configure the tool' },
          { title: 'Execute', description: 'Run the tool process' },
          { title: 'Review', description: 'Review and refine results' },
          { title: 'Complete', description: 'Finalize outputs' }
        ];
    }
  };

  const steps = tool ? getToolSteps(tool.name) : [];

  const handleStepComplete = (stepIndex: number) => {
    const newOutput: ToolOutput = {
      id: `output_${Date.now()}_${stepIndex}`,
      title: steps[stepIndex].title,
      content: `Completed: ${steps[stepIndex].description}`,
      type: 'text',
      completed: true,
      createdAt: new Date()
    };
    
    setOutputs(prev => [...prev, newOutput]);
    
    if (stepIndex < steps.length - 1) {
      setActiveStep(stepIndex + 1);
    } else {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        addToast('Tool completed successfully!', 'success');
        onComplete();
      }, 2000);
    }
  };

  const handleGenerateOutput = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedOutput: ToolOutput = {
      id: `output_${Date.now()}_generated`,
      title: `${tool?.name} Output`,
      content: `Generated output from ${tool?.name}. This would contain the actual results based on your inputs.`,
      type: 'canvas',
      completed: true,
      createdAt: new Date()
    };
    
    setOutputs(prev => [...prev, generatedOutput]);
    setIsGenerating(false);
    addToast('Output generated successfully!', 'success');
  };

  const handleSaveOutput = (output: ToolOutput) => {
    addToast('Output saved to your project!', 'success');
  };

  const handleDownloadOutput = (output: ToolOutput) => {
    addToast('Output downloaded!', 'success');
  };

  const handleShareOutput = (output: ToolOutput) => {
    addToast('Output shared with team!', 'success');
  };

  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{tool.name}</h2>
            <p className="text-gray-600">{tool.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Steps */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Steps</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    index === activeStep
                      ? 'border-purple-500 bg-purple-50'
                      : index < activeStep
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-center gap-3">
                    {index < activeStep ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : index === activeStep ? (
                      <Clock className="w-5 h-5 text-purple-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tool Outputs */}
            {outputs.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Generated Outputs</h4>
                <div className="space-y-2">
                  {outputs.map((output) => (
                    <div key={output.id} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{output.title}</div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSaveOutput(output)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadOutput(output)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShareOutput(output)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{output.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              {/* Current Step */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">{activeStep + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {steps[activeStep]?.title}
                    </h3>
                    <p className="text-gray-600">{steps[activeStep]?.description}</p>
                  </div>
                </div>

                {/* Step Content */}
                <div className="bg-gray-50 rounded-lg p-6">
                  {renderStepContent(activeStep, tool.name)}
                </div>

                {/* Step Actions */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleGenerateOutput()}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Output'}
                    </button>
                    
                    <button
                      onClick={() => handleStepComplete(activeStep)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Complete Step
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">
                    {activeStep + 1} of {steps.length} steps
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderStepContent = (stepIndex: number, toolName: string) => {
  switch (toolName) {
    case 'Empathy Map Builder':
      return renderEmpathyMapStep(stepIndex);
    case 'User Journey Mapper':
      return renderJourneyMapStep(stepIndex);
    case 'POV Statement Builder':
      return renderPOVStep(stepIndex);
    case 'HMW Question Generator':
      return renderHMWStep(stepIndex);
    case 'Brainstorming Canvas':
      return renderBrainstormingStep(stepIndex);
    case 'Assumption Mapper':
      return renderAssumptionMapperStep(stepIndex);
    default:
      return renderGenericStep(stepIndex);
  }
};

const renderEmpathyMapStep = (stepIndex: number) => {
  const steps = [
    <div key="user-type">
      <h4 className="font-semibold mb-3">Select User Type</h4>
      <div className="space-y-2">
        <label className="block">
          <input type="radio" name="userType" value="primary" className="mr-2" />
          Primary User (most important)
        </label>
        <label className="block">
          <input type="radio" name="userType" value="secondary" className="mr-2" />
          Secondary User (influencer)
        </label>
        <label className="block">
          <input type="radio" name="userType" value="tertiary" className="mr-2" />
          Tertiary User (occasional)
        </label>
      </div>
    </div>,
    <div key="think-feel">
      <h4 className="font-semibold mb-3">Think & Feel</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Think</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
            placeholder="What do they think about the problem?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Feel</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
            placeholder="What emotions do they experience?"
          />
        </div>
      </div>
    </div>,
    <div key="see">
      <h4 className="font-semibold mb-3">See</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={4}
        placeholder="What do they see in their environment? What trends do they notice?"
      />
    </div>,
    <div key="say-do">
      <h4 className="font-semibold mb-3">Say & Do</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Say</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
            placeholder="What do they say about the problem?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Do</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
            placeholder="What actions do they take?"
          />
        </div>
      </div>
    </div>,
    <div key="hear">
      <h4 className="font-semibold mb-3">Hear</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={4}
        placeholder="What do they hear from others? What feedback do they receive?"
      />
    </div>,
    <div key="pain">
      <h4 className="font-semibold mb-3">Pain Points</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={4}
        placeholder="What frustrates them? What obstacles do they face?"
      />
    </div>,
    <div key="gains">
      <h4 className="font-semibold mb-3">Gains</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={4}
        placeholder="What would make their life better? What do they hope to achieve?"
      />
    </div>
  ];

  return steps[stepIndex] || <div>Step content not found</div>;
};

const renderJourneyMapStep = (stepIndex: number) => {
  const steps = [
    <div key="define">
      <h4 className="font-semibold mb-3">Define Journey</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Journey Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Customer Onboarding Journey"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Persona</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., New Customer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Journey Goal</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Complete first purchase"
          />
        </div>
      </div>
    </div>,
    <div key="touchpoints">
      <h4 className="font-semibold mb-3">Map Touchpoints</h4>
      <div className="space-y-3">
        {['Awareness', 'Consideration', 'Decision', 'Purchase', 'Support'].map((stage, index) => (
          <div key={stage} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{stage}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={2}
              placeholder={`What happens during ${stage.toLowerCase()}?`}
            />
          </div>
        ))}
      </div>
    </div>,
    <div key="emotion">
      <h4 className="font-semibold mb-3">Emotion Curve</h4>
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-2">Map emotional highs and lows across the journey</div>
        <div className="space-y-2">
          {['High', 'Medium', 'Low'].map((level) => (
            <div key={level} className="flex items-center gap-2">
              <span className="w-16 text-sm">{level}</span>
              <div className="flex-1 h-8 bg-white border border-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    <div key="pain">
      <h4 className="font-semibold mb-3">Pain Points</h4>
      <div className="space-y-3">
        {['Awareness', 'Consideration', 'Decision', 'Purchase', 'Support'].map((stage) => (
          <div key={stage} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{stage}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={2}
              placeholder={`What pain points exist during ${stage.toLowerCase()}?`}
            />
          </div>
        ))}
      </div>
    </div>,
    <div key="opportunities">
      <h4 className="font-semibold mb-3">Opportunities</h4>
      <div className="space-y-3">
        {['Awareness', 'Consideration', 'Decision', 'Purchase', 'Support'].map((stage) => (
          <div key={stage} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{stage}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={2}
              placeholder={`What opportunities exist to improve ${stage.toLowerCase()}?`}
            />
          </div>
        ))}
      </div>
    </div>
  ];

  return steps[stepIndex] || <div>Step content not found</div>;
};

const renderPOVStep = (stepIndex: number) => {
  const steps = [
    <div key="user">
      <h4 className="font-semibold mb-3">User Definition</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={3}
        placeholder="Define your target user (e.g., Small business owner, aged 35-45, struggling with inventory management)"
      />
    </div>,
    <div key="need">
      <h4 className="font-semibold mb-3">Need Identification</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={3}
        placeholder="What do they need to accomplish? (e.g., Track inventory levels in real-time)"
      />
    </div>,
    <div key="insight">
      <h4 className="font-semibold mb-3">Insight Discovery</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={3}
        placeholder="Why does this matter to them? (e.g., Because they lose 15% of revenue to stockouts)"
      />
    </div>,
    <div key="pov">
      <h4 className="font-semibold mb-3">POV Statement</h4>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="text-sm text-purple-700 mb-2">Format: [User] needs [Need] because [Insight]</div>
        <div className="text-lg font-medium text-purple-900">
          [User] needs [Need] because [Insight]
        </div>
      </div>
    </div>
  ];

  return steps[stepIndex] || <div>Step content not found</div>;
};

const renderHMWStep = (stepIndex: number) => {
  const steps = [
    <div key="problem">
      <h4 className="font-semibold mb-3">Problem Analysis</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={4}
        placeholder="Describe the core problem you're trying to solve..."
      />
    </div>,
    <div key="generate">
      <h4 className="font-semibold mb-3">Generate Questions</h4>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex items-center gap-2">
            <span className="w-6 text-sm text-gray-500">{num}.</span>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              placeholder="How might we..."
            />
          </div>
        ))}
      </div>
    </div>,
    <div key="prioritize">
      <h4 className="font-semibold mb-3">Prioritize Questions</h4>
      <div className="space-y-2">
        {['High Impact', 'Medium Impact', 'Low Impact'].map((level) => (
          <div key={level} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{level}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={2}
              placeholder={`Add ${level.toLowerCase()} questions here...`}
            />
          </div>
        ))}
      </div>
    </div>,
    <div key="refine">
      <h4 className="font-semibold mb-3">Refine Questions</h4>
      <div className="space-y-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-700 mb-2">Tips for good HMW questions:</div>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Start with "How might we..."</li>
            <li>• Be specific but not prescriptive</li>
            <li>• Focus on the user's perspective</li>
            <li>• Avoid suggesting solutions</li>
          </ul>
        </div>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          rows={4}
          placeholder="Refine your best HMW questions here..."
        />
      </div>
    </div>
  ];

  return steps[stepIndex] || <div>Step content not found</div>;
};

const renderBrainstormingStep = (stepIndex: number) => {
  const steps = [
    <div key="challenge">
      <h4 className="font-semibold mb-3">Set Challenge</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={3}
        placeholder="Define the specific challenge you want to solve..."
      />
    </div>,
    <div key="generate">
      <h4 className="font-semibold mb-3">Generate Ideas</h4>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="font-medium text-blue-900 mb-2">Crazy 8s Technique</div>
          <div className="text-sm text-blue-700">Set a timer for 8 minutes and draw 8 different solutions</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <div key={num} className="border border-gray-300 rounded-lg p-3 h-24">
              <div className="text-sm text-gray-500 mb-1">Idea {num}</div>
              <textarea
                className="w-full h-full border-0 resize-none"
                placeholder="Your idea..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>,
    <div key="group">
      <h4 className="font-semibold mb-3">Group Ideas</h4>
      <div className="space-y-3">
        {['Digital Solutions', 'Physical Products', 'Service Models', 'Platform Approaches'].map((category) => (
          <div key={category} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{category}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
              placeholder={`Add ideas that fit ${category.toLowerCase()}...`}
            />
          </div>
        ))}
      </div>
    </div>,
    <div key="vote">
      <h4 className="font-semibold mb-3">Vote & Prioritize</h4>
      <div className="space-y-3">
        {['Top 3 Ideas', 'Medium Priority', 'Future Consideration'].map((priority) => (
          <div key={priority} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{priority}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={2}
              placeholder={`Add ${priority.toLowerCase()} ideas...`}
            />
          </div>
        ))}
      </div>
    </div>
  ];

  return steps[stepIndex] || <div>Step content not found</div>;
};

const renderAssumptionMapperStep = (stepIndex: number) => {
  const steps = [
    <div key="list">
      <h4 className="font-semibold mb-3">List Assumptions</h4>
      <div className="space-y-3">
        {['Market Assumptions', 'Product Assumptions', 'Business Model Assumptions', 'Team Assumptions'].map((category) => (
          <div key={category} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{category}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
              placeholder={`List ${category.toLowerCase()}...`}
            />
          </div>
        ))}
      </div>
    </div>,
    <div key="risk">
      <h4 className="font-semibold mb-3">Risk Assessment</h4>
      <div className="space-y-3">
        {['High Risk', 'Medium Risk', 'Low Risk'].map((risk) => (
          <div key={risk} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{risk}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={2}
              placeholder={`Add ${risk.toLowerCase()} assumptions...`}
            />
          </div>
        ))}
      </div>
    </div>,
    <div key="test">
      <h4 className="font-semibold mb-3">Test Planning</h4>
      <div className="space-y-3">
        {['Landing Page Test', 'User Interview', 'Survey', 'Prototype Test'].map((test) => (
          <div key={test} className="border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-2">{test}</div>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={2}
              placeholder={`Plan how to test with ${test.toLowerCase()}...`}
            />
          </div>
        ))}
      </div>
    </div>,
    <div key="priority">
      <h4 className="font-semibold mb-3">Priority Matrix</h4>
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-2">High Impact vs High Risk Matrix</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">Low Impact</div>
          <div className="text-center">Medium Impact</div>
          <div className="text-center">High Impact</div>
          <div className="text-center">High Risk</div>
          <div className="text-center">Medium Risk</div>
          <div className="text-center">Low Risk</div>
        </div>
      </div>
    </div>
  ];

  return steps[stepIndex] || <div>Step content not found</div>;
};

const renderGenericStep = (stepIndex: number) => {
  return (
    <div>
      <h4 className="font-semibold mb-3">Step {stepIndex + 1}</h4>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={4}
        placeholder="Enter your input for this step..."
      />
    </div>
  );
};

export default DesignThinkingToolModal;
