
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main: Starting application...')

const rootElement = document.getElementById("root")
if (!rootElement) {
  console.error('Main: Root element not found!')
  throw new Error('Root element not found')
}

console.log('Main: Root element found, creating app...')
createRoot(rootElement).render(<App />);
