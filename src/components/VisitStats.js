import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import db from '../firebase-config'
import { DEVICE_LABELS, SOURCE_LABELS, getKstDay } from '../visitTracker'

const box = { maxWidth: 720, margin: '0 auto 24px', padding: '20px', border: '1px solid #e5dcd3', borderRadius: 14, background: '#fffaf5', color: '#3a2c23', fontFamily: 'sans-serif' }
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, margin: '14px 0' }
const card = { padding: '12px', borderRadius: 10, background: '#fff', border: '1px solid #eee3d9' }
const big = { fontSize: 26, fontWeight: 700, marginTop: 4 }
const small = { fontSize: 13, color: '#7a6555' }

function countBy(items, key) {
  const counts = {}
  items.forEach((item) => {
    const value = item[key] || 'other'
    counts[value] = (counts[value] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

function uniqueCount(items) {
  return new Set(items.map((item) => item.visitorId)).size
}

function Bars({ rows, labels }) {
  const max = Math.max(1, ...rows.map((row) => row[1]))
  return (
    <div>
      {rows.map(([key, value]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0', fontSize: 14 }}>
          <div style={{ width: 110, flexShrink: 0 }}>{(labels && labels[key]) || key}</div>
          <div style={{ flex: 1, background: '#f1e7de', borderRadius: 6, height: 14 }}>
            <div style={{ width: (value / max) * 100 + '%', background: '#b08968', borderRadius: 6, height: 14 }} />
          </div>
          <div style={{ width: 44, textAlign: 'right' }}>{value}</div>
        </div>
      ))}
    </div>
  )
}

function VisitStats() {
  const [visits, setVisits] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const snapshot = await getDocs(collection(db, 'visits'))
      setVisits(snapshot.docs.map((doc) => doc.data()))
    } catch (err) {
      setError('방문 기록을 불러오지 못했습니다. (' + (err.code || err.message) + ')')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const today = getKstDay()
  const list = (visits || []).filter((visit) => visit.path !== '/test')
  const todayList = list.filter((visit) => visit.day === today)
  const days = Array.from({ length: 14 }, (_, index) => getKstDay(new Date(Date.now() - index * 86400000)))
  const dailyRows = days.map((day) => {
    const dayList = list.filter((visit) => visit.day === day)
    return [day.slice(5).replace('-', '/'), dayList.length, uniqueCount(dayList)]
  })
  const dailyMax = Math.max(1, ...dailyRows.map((row) => row[1]))

  return (
    <section style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>방문자 통계</h2>
        <button type='button' onClick={load} disabled={loading}>{loading ? '불러오는 중...' : '새로고침'}</button>
      </div>
      <p style={small}>
        이름, IP 등 개인을 알 수 있는 정보는 저장하지 않습니다. 같은 폰·브라우저로 다시 열면 같은 방문자로 셉니다.
        관리자로 로그인한 브라우저와 /test 페이지 방문은 집계에서 빠집니다.
      </p>
      {error && <p role='alert'>{error}</p>}
      {visits && (
        <>
          <div style={grid}>
            <div style={card}><div style={small}>전체 방문</div><div style={big}>{list.length}</div></div>
            <div style={card}><div style={small}>전체 방문자</div><div style={big}>{uniqueCount(list)}</div></div>
            <div style={card}><div style={small}>오늘 방문</div><div style={big}>{todayList.length}</div></div>
            <div style={card}><div style={small}>오늘 방문자</div><div style={big}>{uniqueCount(todayList)}</div></div>
          </div>

          <h3 style={{ fontSize: 16, margin: '18px 0 6px' }}>최근 14일 (방문 / 방문자)</h3>
          <div>
            {dailyRows.map(([day, count, unique]) => (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0', fontSize: 14 }}>
                <div style={{ width: 52, flexShrink: 0 }}>{day}</div>
                <div style={{ flex: 1, background: '#f1e7de', borderRadius: 6, height: 12 }}>
                  <div style={{ width: (count / dailyMax) * 100 + '%', background: '#b08968', borderRadius: 6, height: 12 }} />
                </div>
                <div style={{ width: 70, textAlign: 'right' }}>{count} / {unique}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 16, margin: '18px 0 6px' }}>유입 경로</h3>
          <Bars rows={countBy(list, 'source')} labels={SOURCE_LABELS} />

          <h3 style={{ fontSize: 16, margin: '18px 0 6px' }}>기기</h3>
          <Bars rows={countBy(list, 'device')} labels={DEVICE_LABELS} />
        </>
      )}
    </section>
  )
}

export default VisitStats
