import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> 
  // StrictMode removed to avoid double mounting of Webcam/FaceAPI in dev
  <App />
  // </React.StrictMode>,
)
