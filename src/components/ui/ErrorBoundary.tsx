import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // En producción, aquí podrías enviar el error a un servicio de monitoreo
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <span className="material-icons-outlined text-5xl text-red-500">error_outline</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                            Algo salió mal
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Ha ocurrido un error inesperado. Por favor, recarga la página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
                        >
                            Recargar página
                        </button>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    Ver detalles del error (solo desarrollo)
                                </summary>
                                <pre className="mt-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl overflow-auto max-h-48">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
