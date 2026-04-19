import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/AuthContext';

// Lazy loading components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'));
const Kiosk = lazy(() => import('./pages/Kiosk.tsx'));
const Login = lazy(() => import('./pages/Login.tsx'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-6">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary/10 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0"></div>
    </div>
    <div className="flex flex-col items-center">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Sincronizando Módulos</p>
    </div>
  </div>
);

import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  if (!API_URL) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 p-10 rounded-[2.5rem] border border-red-500/20 shadow-2xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="material-icons text-red-500 text-4xl">cloud_off</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-3">Error de Conexión</h1>
          <p className="text-slate-400 font-medium leading-relaxed">
            No se ha podido establecer la comunicación con el servidor central. 
            Por favor, contacte con el soporte técnico o verifique la configuración del sistema.
          </p>
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Referencia Técnica: ERR_CONFIG_MISSING</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-center" richColors closeButton theme="system" />
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/kiosk" element={<Kiosk />} />
              <Route path="/" element={<Navigate to="/kiosk" />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
