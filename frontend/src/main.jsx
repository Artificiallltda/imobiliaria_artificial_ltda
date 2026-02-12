import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/ui/index.js'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { I18nProvider } from './i18n/index.jsx'   // 👈 adiciona isso

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>  {/* 👈 envolve o App */}
        <ToastProvider>
          <App />
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
