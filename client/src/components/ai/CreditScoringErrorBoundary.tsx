import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, FileText, Mail } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary specifically designed for credit scoring components
 */
export class CreditScoringErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // In production, this would send to your error monitoring service
    console.error('Credit Scoring Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorReport = {
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Create mailto link with error details
    const subject = encodeURIComponent('Credit Scoring System Error Report');
    const body = encodeURIComponent(`
Error Report:
${JSON.stringify(errorReport, null, 2)}

Please describe what you were doing when this error occurred:
[User description here]
    `);
    
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  Credit Scoring System Error
                </h1>
                <p className="text-slate-600">
                  We encountered an unexpected error while processing your request.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-slate-800 mb-2">Error Details:</h3>
                <p className="text-sm text-slate-600 font-mono bg-white p-3 rounded border">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <RefreshCw size={20} />
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-2 bg-slate-600 text-white px-4 py-3 rounded-lg hover:bg-slate-700 transition font-semibold"
                >
                  <RefreshCw size={20} />
                  Reload Page
                </button>
                
                <button
                  onClick={this.handleReportError}
                  className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                >
                  <Mail size={20} />
                  Report Error
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Troubleshooting Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Try using a different browser</li>
                  <li>• Ensure all required fields are filled correctly</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-6">
                  <summary className="cursor-pointer font-semibold text-slate-700">
                    Developer Details (Development Mode)
                  </summary>
                  <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold mb-2">Stack Trace:</h4>
                    <pre className="text-xs text-gray-700 overflow-auto">
                      {this.state.error?.stack}
                    </pre>
                    <h4 className="font-semibold mb-2 mt-4">Component Stack:</h4>
                    <pre className="text-xs text-gray-700 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: T) {
    return (
      <CreditScoringErrorBoundary fallback={fallback}>
        <Component {...props} />
      </CreditScoringErrorBoundary>
    );
  };
}

export default CreditScoringErrorBoundary;
