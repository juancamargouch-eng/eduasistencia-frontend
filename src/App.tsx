import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Kiosk from './pages/Kiosk.tsx';
import Login from './pages/Login.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';

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
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
