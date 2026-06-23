import React from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  Copy, 
  Check, 
  Home, 
  ChevronDown, 
  ChevronUp, 
  Terminal 
} from 'lucide-react';
import { analytics } from '../lib/analytics.ts';


interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  copied: boolean;
  showTrace: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showTrace: false
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
      showTrace: false
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error("Critical error captured by TextToolkitHub ErrorBoundary:", error, errorInfo);
    
    // Safety fire crash statistics tracking
    try {
      analytics.trackErrorBoundaryCrash(error.message, `STACK_${error.message.replace(/\s+/g, '_').substring(0, 30)}`);
    } catch (e) {
      console.warn("Failed tracking system error boundary crash:", e);
    }
  }

  // Action: Simple component retry (react re-renders the children block from current hash)
  private handleRetry = () => {
    const errorMsg = String(this.state.error?.message || '').toLowerCase();
    const isChunkOrAssetError = 
      errorMsg.includes('fetch') ||
      errorMsg.includes('module') ||
      errorMsg.includes('script') ||
      errorMsg.includes('chunk') ||
      errorMsg.includes('text/html') ||
      errorMsg.includes('mime');

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showTrace: false
    });

    if (isChunkOrAssetError) {
      window.location.reload();
    }
  };

  // Action: Return to corporate dashboard safely and reset states
  private handleResetAndHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showTrace: false
    });
    
    // Set hash route to landing page safely
    window.location.hash = '/';
    
    // If the hash was already home and somehow corrupted, trigger a clean state reload
    if (window.location.hash === '#' || window.location.hash === '#/' || !window.location.hash) {
      window.location.reload();
    }
  };

  private toggleTraceVisibility = () => {
    this.setState((prevState) => ({ showTrace: !prevState.showTrace }));
  };

  private handleCopyError = async () => {
    if (!this.state.error) return;
    
    const debugPayload = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      errorMessage: this.state.error.message,
      errorStack: this.state.error.stack || 'No stack trace recorded',
      componentStack: this.state.errorInfo?.componentStack || 'No component structure available'
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(debugPayload, null, 2));
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.warn("Unable to copy diagnostic telemetry logs", err);
    }
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 bg-slate-50/50 dark:bg-[#070a13]/20">
          <div className="max-w-2xl w-full bg-white dark:bg-[#0c111d] p-6 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-850 shadow-xl relative overflow-hidden">
            
            {/* Top design accent header bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-indigo-600" />
            
            <div className="text-center relative z-10">
              {/* Animated Warning Icon Block */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 mb-5 border border-rose-100 dark:border-rose-950/40 shadow-sm">
                <AlertTriangle className="h-8 w-8 animate-pulse" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white" id="error-title">
                Something didn't format right
              </h2>
              
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                App apologies! An unexpected calculation abnormality occurred. Your input strings in the active session remain safely isolated and secure inside client memory space.
              </p>
            </div>

            {/* Error Message Header Display */}
            <div className="mt-6 p-4 rounded-2xl border border-red-100 dark:border-red-950/40 bg-red-50/30 dark:bg-red-950/10 flex items-start gap-3">
              <Terminal className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-rose-600 dark:text-rose-400 block mb-0.5">
                  Handled Local Error Exception:
                </span>
                <p className="text-xs font-mono text-slate-800 dark:text-slate-300 break-words">
                  {this.state.error?.message || 'Unknown javascript client runtime exception'}
                </p>
              </div>
            </div>

            {/* Collapsible Diagnostics Accordion Pane */}
            <div className="mt-4 border border-slate-100 dark:border-slate-850/80 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={this.toggleTraceVisibility}
                className="w-full text-left py-3 px-4 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 outline-none"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Show Advanced Diagnostic System Logs</span>
                </span>
                {this.state.showTrace ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {this.state.showTrace && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-850/60 font-mono text-[10px] space-y-4 max-h-64 overflow-y-auto">
                  
                  {/* Copy technical logs wrapper */}
                  <div className="flex justify-between items-center bg-white dark:bg-[#070a13] p-2 rounded-lg border border-slate-100 dark:border-slate-850 mb-3">
                    <span className="text-slate-400">Perfect representation of logs for reports:</span>
                    <button
                      type="button"
                      onClick={this.handleCopyError}
                      className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 rounded transition-all duration-150 flex items-center gap-1 cursor-pointer font-sans text-xs"
                    >
                      {this.state.copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Setup
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Diagnostic Data
                        </>
                      )}
                    </button>
                  </div>

                  {this.state.error?.stack && (
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase tracking-wider">Engine Stack Trace:</span>
                      <pre className="text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-w-full">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}

                  {this.state.errorInfo?.componentStack && (
                    <div className="border-t border-slate-100 dark:border-slate-850/30 pt-3">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1 uppercase tracking-wider">React UI Component Hierarchy:</span>
                      <pre className="text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-w-full">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Bottom Actions Layout (Try Again & Return to Dashboard) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              
              <button
                type="button"
                onClick={this.handleRetry}
                className="flex-1 py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold tracking-wider uppercase font-sans rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98]"
                id="error-reset-btn"
              >
                <RotateCcw className="w-4 h-4" /> 
                <span>Try Again &amp; Reload</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetAndHome}
                className="flex-grow py-3 px-5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold tracking-wider uppercase font-sans rounded-xl transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98]"
                id="error-home-btn"
              >
                <Home className="w-4 h-4 text-slate-400" /> 
                <span>Return to Homepage</span>
              </button>

            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
