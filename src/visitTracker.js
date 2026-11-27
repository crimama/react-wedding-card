import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import db from './firebase-config'

const VISITOR_KEY = 'wedding-visitor-id'
const SESSION_KEY = 'wedding-visit-logged'
const EXCLUDE_KEY = 'wedding-visit-exclude'

export const SOURCE_LABELS = {
  kakaotalk: '카카오톡',
  instagram: '인스타그램',
  naver: '네이버',
  facebook: '페이스북',
  line: '라인',
  google: '구글',
  bitly: '단축링크',
  internal: '내부 이동',
  direct: '직접 접속·QR',
  other: '기타',
}

export const DEVICE_LABELS = {
  ios: '아이폰·아이패드',
  android: '안드로이드',
  pc: 'PC',
}

export function getKstDay(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

function getSource() {
  const ua = navigator.userAgent || ''
  if (/KAKAOTALK/i.test(ua)) return 'kakaotalk'
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/NAVER/i.test(ua)) return 'naver'
  if (/FBAN|FBAV/i.test(ua)) return 'facebook'
  if (/ Line\//i.test(ua)) return 'line'
  const referrer = document.referrer || ''
  if (!referrer) return 'direct'
  try {
    const host = new URL(referrer).hostname
    if (host === window.location.hostname) return 'internal'
    if (host.includes('kakao')) return 'kakaotalk'
    if (host.includes('naver')) return 'naver'
    if (host.includes('instagram')) return 'instagram'
    if (host.includes('facebook')) return 'facebook'
    if (host.includes('google')) return 'google'
    if (host.includes('bit.ly')) return 'bitly'
  } catch (error) {
    return 'other'
  }
  return 'other'
}

function getDevice() {
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'pc'
}

function makeId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 12)
}

export function excludeThisBrowser() {
  try { localStorage.setItem(EXCLUDE_KEY, '1') } catch (error) {}
}

export async function logVisit() {
  try {
    const params = new URLSearchParams(window.location.search)
    const path = window.location.pathname.replace(/\/$/, '')
    if (params.has('admin') || path.endsWith('/admin')) return
    if (/bot|crawler|spider|scrap|preview|headless/i.test(navigator.userAgent || '')) return
    if (localStorage.getItem(EXCLUDE_KEY) === '1') return
    if (sessionStorage.getItem(SESSION_KEY) === '1') return
    sessionStorage.setItem(SESSION_KEY, '1')

    let visitorId = localStorage.getItem(VISITOR_KEY)
    const newVisitor = !visitorId
    if (!visitorId) {
      visitorId = makeId()
      localStorage.setItem(VISITOR_KEY, visitorId)
    }

    await addDoc(collection(db, 'visits'), {
      createdAt: serverTimestamp(),
      day: getKstDay(),
      visitorId: visitorId.slice(0, 40),
      source: getSource(),
      device: getDevice(),
      path: path.endsWith('/test') ? '/test' : '/',
      newVisitor,
    })
  } catch (error) {
    // Visit logging must never affect the invitation.
  }
}
