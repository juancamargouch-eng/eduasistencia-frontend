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
          <span className="material-icons text-red-500 text-6xl mb-4">gpp_maybe</span>
          <h1 className="text-2xl font-black text-white mb-2">Error de Configuración</h1>
          <p className="text-slate-400 font-medium">Falta la variable <code className="text-red-400 bg-red-400/10 px-2 py-0.5 rounded">VITE_API_BASE_URL</code> en el archivo <code className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded">.env</code>.</p>
          <div className="mt-8 p-4 bg-slate-800/50 rounded-2xl text-left border border-slate-700">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Solución:</p>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal ml-4">
              <li>Cree un archivo <code className="text-indigo-400">.env</code> en el root del frontend.</li>
              <li>Añada: <code className="text-green-400">VITE_API_BASE_URL=http://localhost:8000/api</code></li>
              <li>Reinicie el servidor de desarrollo.</li>
            </ol>
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
