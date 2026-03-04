import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-red-100 dark:border-red-900/20">
                        <span className="material-icons text-red-500 text-6xl mb-4 animate-bounce">error_outline</span>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Algo salió mal</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                            Ha ocurrido un error inesperado en la interfaz. Por favor, intenta recargar la página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Recargar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
