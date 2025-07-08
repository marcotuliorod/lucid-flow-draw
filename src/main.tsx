
import { createRoot } from 'react-dom/client'
import { StrictMode, Suspense } from 'react'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/LoadingSpinner'
import './index.css'

console.log('Main: Starting application...')

const rootElement = document.getElementById("root")
if (!rootElement) {
  console.error('Main: Root element not found!')
  throw new Error('Root element not found')
}

console.log('Main: Root element found, creating app...')
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
