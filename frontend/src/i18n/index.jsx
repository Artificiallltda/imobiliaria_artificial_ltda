import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import ptBR from './pt-BR'
import enUS from './en-US'
import esES from './es-ES'

const STORAGE_KEY = 'locale'

const I18nContext = createContext(null)

const DICTS = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
}

function get(obj, path) {
  return path.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj)
}

function interpolate(str, params = {}) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`))
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved && DICTS[saved] ? saved : 'pt-BR'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.setAttribute('lang', locale)
  }, [locale])

  const dict = useMemo(() => DICTS[locale] || ptBR, [locale])

  const t = useMemo(() => {
    return (key, params) => {
      const raw = get(dict, key) ?? get(ptBR, key) ?? key
      if (typeof raw !== 'string') return key
      return interpolate(raw, params)
    }
  }, [dict])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
