import React, { Component, ErrorInfo, ReactNode } from "react";
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOnline: boolean;
  wsErrorCount: number;
  lastWsErrorUrl: string | null;
  showDismissedBanner: boolean;
}

export class NetworkErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    wsErrorCount: 0,
    lastWsErrorUrl: null,
    showDismissedBanner: false
  };

  private handleOnline = () => {
    this.setState({ isOnline: true });
  };

  private handleOffline = () => {
    this.setState({ isOnline: false });
  };

  private handleWsError = (event: Event) => {
    const customEvent = event as CustomEvent;
    const url = customEvent.detail?.url || "unknown";
    this.setState((prev) => ({
      wsErrorCount: prev.wsErrorCount + 1,
      lastWsErrorUrl: url,
      showDismissedBanner: false
    }));
  };

  public componentDidMount() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
      window.addEventListener("websocket-connection-error", this.handleWsError);
    }
  }

  public componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
      window.removeEventListener("websocket-connection-error", this.handleWsError);
    }
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[NetworkErrorBoundary] Caught exception:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      wsErrorCount: 0,
      lastWsErrorUrl: null
    });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  private dismissBanner = () => {
    this.setState({ showDismissedBanner: true });
  };

  public render() {
    const { hasError, error, isOnline, wsErrorCount, lastWsErrorUrl, showDismissedBanner } = this.state;

    // 1. Critical rendering error fallback
    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800/80 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />
            
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-amber-500/10 text-amber-500 mb-6">
              <AlertTriangle className="h-10 w-10" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-100 mb-3">
              Scripture Sanctuary Paused
            </h1>
            
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              An unexpected render or script sync failure occurred. This is often resolved by clearing cached resources and forcing a clean connection.
            </p>

            {error && (
              <div className="bg-slate-950/80 rounded-lg p-3.5 mb-6 text-left border border-slate-850">
                <p className="text-[11px] font-mono text-rose-400 break-all leading-tight">
                  {error.name}: {error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleRetry}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-white text-slate-950 font-medium rounded-xl transition duration-150 shadow-lg cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset & Try Reconnect
            </button>
          </div>
        </div>
      );
    }

    // 2. Main layout wrapping with non-intrusive connection warning toasts/banners
    return (
      <div className="relative min-h-screen">
        {/* Banner if actual browser is offline */}
        {!isOnline && (
          <div className="sticky top-0 z-50 w-full bg-amber-600 text-amber-50 px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-300">
            <WifiOff className="h-4 w-4 animate-pulse" />
            <span>
              You are currently viewing Interfaith Scripture Academy in **Offline Mode**. Saved prayers, readings, and translations remain readable.
            </span>
            <button 
              onClick={() => this.setState({ isOnline: navigator.onLine })}
              className="ml-3 bg-amber-700/60 hover:bg-amber-800/80 px-2 py-1 rounded text-[10px] transition font-bold uppercase tracking-wider"
            >
              Check Connection
            </button>
          </div>
        )}

        {/* Real non-dev WebSocket error warning toast */}
        {wsErrorCount > 0 && !showDismissedBanner && isOnline && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-slate-800/90 rounded-xl p-4 shadow-2xl flex gap-3.5 items-start animate-in fade-in slide-in-from-bottom duration-300">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Wifi className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-slate-200">Live Sync Reconnecting</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                Real-time commentary sync socket failed to resolve. The app will automatically fall back to lazy query polling.
              </p>
              {lastWsErrorUrl && (
                <div className="mt-1.5 text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded inline-block truncate max-w-xs">
                  {lastWsErrorUrl}
                </div>
              )}
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={this.handleRetry}
                  className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1 px-2.5 rounded-md transition"
                >
                  Force Sync Now
                </button>
                <button
                  onClick={this.dismissBanner}
                  className="text-[10px] text-slate-400 hover:text-slate-200 py-1 px-1.5 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {this.props.children}
      </div>
    );
  }
}
