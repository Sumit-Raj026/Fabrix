import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { CONFIG } from '../config';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Uncaught error in React Error Boundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center p-6 text-center text-stone-150">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-serif font-bold tracking-wider mb-2">
            Oops! Something went wrong.
          </h1>
          <p className="text-stone-400 mb-8 max-w-md">
            We encountered an unexpected error while loading {CONFIG.STORE_NAME}. Our team has been notified.
          </p>
          
          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-charcoal font-medium rounded hover:bg-yellow-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Page
          </button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-12 text-left bg-stone-900 p-6 rounded border border-red-900/50 max-w-4xl w-full overflow-auto">
              <h3 className="text-red-400 font-mono font-bold mb-2">Developer Details:</h3>
              <p className="text-red-300 font-mono text-sm whitespace-pre-wrap mb-4">
                {this.state.error.toString()}
              </p>
              <pre className="text-stone-500 font-mono text-xs whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
