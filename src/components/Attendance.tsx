import { useMemo } from 'react'
import { todayStr } from '../lib/attendance'

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']

interface AttendanceProps {
  streak: number
  checkedDates?: string[]
  onCheck: () => { ok: boolean; reward: { streak: number; coins?: number; gachaTicket?: number; title?: string } | null }
}

export function Attendance({ streak, checkedDates = [], onCheck }: AttendanceProps) {
  const today = todayStr()
  const alreadyChecked = checkedDates.includes(today)

  const weekStart = useMemo(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day
    const start = new Date(d)
    start.setDate(diff)
    return start
  }, [])

  const days = useMemo(() => {
    const arr: { date: Date; label: string; checked: boolean; isToday: boolean }[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      arr.push({
        date: d,
        label: WEEKDAY[d.getDay()],
        checked: checkedDates.includes(dateStr),
        isToday: dateStr === today,
      })
    }
    return arr
  }, [weekStart, checkedDates, today])

  const handleCheck = () => {
    const result = onCheck()
    if (result.ok && result.reward) {
      alert(`출석 완료! ${result.reward.streak}일 연속.\n${result.reward.coins ? `+${result.reward.coins}코인 ` : ''}${result.reward.gachaTicket ? '가챠권 1장 ' : ''}${result.reward.title ?? ''}`)
    }
  }

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.5rem' }}>📅 연속 출석</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        3일 연속: 100코인 · 7일: 500코인+가챠권 · 30일: 레전드 칭호+5,000코인
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {days.map((d) => (
          <div
            key={d.date.toISOString()}
            style={{
              width: 36,
              textAlign: 'center',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              background: d.checked ? 'var(--up)' : 'var(--bg-glass)',
              color: d.checked ? '#fff' : 'var(--text-muted)',
              border: d.isToday ? '2px solid var(--accent)' : undefined,
              fontSize: '0.8rem',
            }}
          >
            <div>{d.label}</div>
            <div>{d.checked ? '✅' : '⬜'}</div>
          </div>
        ))}
      </div>
      <button type="button" className="btn-buy" onClick={handleCheck} disabled={alreadyChecked}>
        {alreadyChecked ? '오늘 출석 완료' : '출석하기'}
      </button>
      {streak > 0 && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>현재 {streak}일 연속!</p>}
    </div>
  )
}
