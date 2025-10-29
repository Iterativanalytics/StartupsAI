import React from 'react';
import { NavItem } from './NavItem';
import { ChevronDown, Users, Lightbulb, Target, Wrench, TestTube } from 'lucide-react';

export function LLDTNavigation() {
  return (
    <div className="relative group">
      <NavItem to="/design-thinking" label="Lean Design Thinking™" icon={Users} />
      
      {/* Dropdown Menu */}
      <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {/* Empathize Phase */}
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Empathize
          </h3>
          <a 
            href="/design-thinking/empathize" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Users className="w-4 h-4" />
            Empathy Maps
          </a>
          <a 
            href="/design-thinking/empathize/user-journey" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Target className="w-4 h-4" />
            User Journey Maps
          </a>
          <a 
            href="/design-thinking/empathize/interviews" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Users className="w-4 h-4" />
            Interview Guide
          </a>
        </div>

        {/* Define Phase */}
        <div className="px-4 py-2 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Define
          </h3>
          <a 
            href="/design-thinking/define" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Target className="w-4 h-4" />
            POV Statements
          </a>
          <a 
            href="/design-thinking/define/hmw" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Lightbulb className="w-4 h-4" />
            HMW Questions
          </a>
        </div>

        {/* Ideate Phase */}
        <div className="px-4 py-2 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Ideate
          </h3>
          <a 
            href="/design-thinking/ideate" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Lightbulb className="w-4 h-4" />
            Brainstorming
          </a>
          <a 
            href="/design-thinking/ideate/ideas" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Target className="w-4 h-4" />
            Idea Management
          </a>
        </div>

        {/* Prototype Phase */}
        <div className="px-4 py-2 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Prototype
          </h3>
          <a 
            href="/design-thinking/prototype" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Wrench className="w-4 h-4" />
            Prototype Planner
          </a>
          <a 
            href="/design-thinking/prototype/storyboard" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Target className="w-4 h-4" />
            Storyboard Builder
          </a>
        </div>

        {/* Test Phase */}
        <div className="px-4 py-2 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Test
          </h3>
          <a 
            href="/design-thinking/test" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <TestTube className="w-4 h-4" />
            Test Sessions
          </a>
          <a 
            href="/design-thinking/test/validation" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Target className="w-4 h-4" />
            Validation Dashboard
          </a>
        </div>

        {/* Advanced Features */}
        <div className="px-4 py-2 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Advanced
          </h3>
          <a 
            href="/design-thinking/sprints" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Target className="w-4 h-4" />
            Design Sprints
          </a>
          <a 
            href="/design-thinking/lean" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <Lightbulb className="w-4 h-4" />
            Lean Startup
          </a>
        </div>
      </div>
    </div>
  );
}
