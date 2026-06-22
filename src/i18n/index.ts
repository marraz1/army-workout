import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import lt from './lt.json'
import { loadProfile } from '@/lib/storage'

/** i18next uses lowercase codes; our UI/profile use uppercase 'EN' | 'LT'. */
const stored = loadProfile()?.language
const initialLng = stored === 'LT' ? 'lt' : 'en'

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    lt: { translation: lt },
  },
  lng: initialLng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
