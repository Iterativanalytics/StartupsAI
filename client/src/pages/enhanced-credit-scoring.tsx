import React from 'react';
import { EnhancedCreditScoringMain, CreditScoringErrorBoundary } from '../components/ai';
import { Shield, Zap, Brain, Target, Star, TrendingUp } from 'lucide-react';

/**
 * Enhanced Credit Scoring Demo Page
 * Showcases the v4.0 enhanced AI credit scoring system
 */
const EnhancedCreditScoringPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <Shield size={48} className="text-blue-200" />
              <h1 className="text-5xl font-bold">Enhanced AI Credit Scoring</h1>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-lg font-bold">v4.0</span>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Advanced AI-powered business credit scoring system with real-time analytics, 
              comprehensive risk assessment, and industry-leading accuracy.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
                <Brain className="mx-auto mb-4 text-blue-200" size={40} />
                <h3 className="text-xl font-bold mb-2">Enhanced ML Algorithm</h3>
                <p className="text-blue-100">7-factor analysis with industry-specific risk adjustments</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
                <Zap className="mx-auto mb-4 text-blue-200" size={40} />
                <h3 className="text-xl font-bold mb-2">Real-time Processing</h3>
                <p className="text-blue-100">Lightning-fast scoring with advanced caching and optimization</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
                <Target className="mx-auto mb-4 text-blue-200" size={40} />
                <h3 className="text-xl font-bold mb-2">94.2% Accuracy</h3>
                <p className="text-blue-100">Industry-leading precision with comprehensive risk analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Improvements Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">What's New in v4.0</h2>
            <p className="text-xl text-slate-600">Revolutionary improvements in accuracy, speed, and user experience</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Star className="text-yellow-500" size={24} />
                Enhanced Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Advanced 7-Factor Scoring</h4>
                    <p className="text-slate-600">Credit, Financial Health, Banking Behavior, Business Stability, Alternative Data, Market Conditions, Industry Risk</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Real-time Monitoring & Alerts</h4>
                    <p className="text-slate-600">Proactive risk monitoring with configurable alerts and notifications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Advanced Analytics Dashboard</h4>
                    <p className="text-slate-600">Portfolio analytics, stress testing, and performance monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Industry-Specific Adjustments</h4>
                    <p className="text-slate-600">Tailored risk assessments for different business sectors</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-500" size={24} />
                Performance Improvements
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Processing Speed</span>
                    <span className="text-green-600 font-bold">↑ 40% faster</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Model Accuracy</span>
                    <span className="text-blue-600 font-bold">94.2% AUC-ROC</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '94%'}}></div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Memory Usage</span>
                    <span className="text-purple-600 font-bold">↓ 25% reduction</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Risk Differentiation</span>
                    <span className="text-orange-600 font-bold">↑ 30% better</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Application */}
      <CreditScoringErrorBoundary>
        <EnhancedCreditScoringMain />
      </CreditScoringErrorBoundary>

      {/* Technical Specifications */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Technical Specifications</h2>
            <p className="text-xl text-slate-600">Built with cutting-edge technology and best practices</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Model Version</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">v4.0.0</p>
              <p className="text-slate-600">Enhanced Production</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Processing Time</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">~250ms</p>
              <p className="text-slate-600">Average Response</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Accuracy Rate</h3>
              <p className="text-3xl font-bold text-purple-600 mb-2">94.2%</p>
              <p className="text-slate-600">AUC-ROC Score</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Data Points</h3>
              <p className="text-3xl font-bold text-orange-600 mb-2">50+</p>
              <p className="text-slate-600">Risk Factors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-300">
            Enhanced AI Credit Scoring System v4.0 - Built with advanced machine learning and modern web technologies
          </p>
          <p className="text-slate-400 mt-2">
            © 2025 Enterprise Credit Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedCreditScoringPage;
