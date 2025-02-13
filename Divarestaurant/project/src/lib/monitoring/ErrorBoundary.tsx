import React, { Component, ErrorInfo } from 'react';
import { MonitoringService } from './MonitoringService';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  private monitoringService = MonitoringService.getInstance();

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur dans le service de monitoring
    this.monitoringService.logError(error, {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Callback optionnel pour la gestion personnalisée des erreurs
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="bg-admin-card p-8 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle className="text-red-500" size={32} />
              <h2 className="text-2xl font-serif">Une erreur est survenue</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-400">
                Nous nous excusons pour la gêne occasionnée. Notre équipe technique a été notifiée et travaille à résoudre le problème.
              </p>

              {this.state.error && (
                <div className="bg-red-500/10 p-4 rounded-lg">
                  <p className="text-red-400 font-mono text-sm">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gold text-black rounded hover:bg-gold/90 transition-colors"
                >
                  Recharger la page
                </button>
                <a
                  href="/"
                  className="px-4 py-2 border border-white/20 text-white rounded hover:bg-white/5 transition-colors"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}