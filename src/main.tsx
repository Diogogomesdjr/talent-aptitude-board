
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Recover the redirect path from sessionStorage when coming from 404.html
const redirectPath = sessionStorage.getItem('redirect');
if (redirectPath) {
  sessionStorage.removeItem('redirect');
  window.history.replaceState(null, '', redirectPath);
}

createRoot(document.getElementById("root")!).render(<App />);
