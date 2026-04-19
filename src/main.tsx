import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento root. Verifica tu index.html');
}

ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  // StrictMode removed to avoid double mounting of Webcam/FaceAPI in dev
  <App />
  // </React.StrictMode>,
)
