'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import lt from './lt.json'

// Always start with 'en' so server and client render identically (no hydration
// mismatch). AppContext switches to the user's saved language after login via
// i18n.changeLanguage(), which runs client-side only.
if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      lt: { translation: lt },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
}

export default i18n
