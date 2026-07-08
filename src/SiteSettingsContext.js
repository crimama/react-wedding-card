import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import db from './firebase-config'
import defaultSiteConfig from './defaultSiteConfig'

const SETTINGS_DOC_PATH = ['settings', 'main']

const SiteSettingsContext = createContext({
  settings: defaultSiteConfig,
  isLoadingSettings: true,
})

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

export function mergeSettings(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base
  if (!isPlainObject(base)) return override === undefined || override === null ? base : override

  const merged = { ...base }
  if (!isPlainObject(override)) return merged

  Object.keys(override).forEach((key) => {
    const baseValue = base[key]
    const overrideValue = override[key]
    if (isPlainObject(baseValue)) {
      merged[key] = mergeSettings(baseValue, overrideValue)
    } else if (Array.isArray(baseValue)) {
      merged[key] = Array.isArray(overrideValue) ? overrideValue : baseValue
    } else if (overrideValue !== undefined && overrideValue !== null) {
      merged[key] = overrideValue
    }
  })

  return merged
}

export function getSettingsDocRef() {
  return doc(db, ...SETTINGS_DOC_PATH)
}

export function SiteSettingsProvider({ children }) {
  const [remoteSettings, setRemoteSettings] = useState(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      getSettingsDocRef(),
      (snapshot) => {
        setRemoteSettings(snapshot.exists() ? snapshot.data() : null)
        setIsLoadingSettings(false)
      },
      (error) => {
        console.error('Failed to load site settings', error)
        setIsLoadingSettings(false)
      }
    )

    return unsubscribe
  }, [])

  const value = useMemo(() => ({
    settings: mergeSettings(defaultSiteConfig, remoteSettings),
    isLoadingSettings,
  }), [remoteSettings, isLoadingSettings])

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export { defaultSiteConfig }
