import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Start MSW in development before rendering (avoid fetch race)
async function enableMocking() {
  try {
    if (import.meta.env.MODE !== 'development') return
    if (import.meta.env.VITE_ENABLE_MSW !== 'true') return
    const { worker } = await import('./mocks/browser')
    await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } })
  } catch (e) {
    console.warn('MSW failed to start, continuing without mocks')
  }
}
import './index.css'
import './styles.css'
import App from './App.tsx'

;(async () => {
  await enableMocking()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})()
