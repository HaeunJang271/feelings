// 목업 리더보드 (실제 수익률은 백엔드 연동 시 계산)
const MOCK_LEADERS = [
  { rank: 1, name: '익명의갓투자자', yield: 2450, note: '"설렘" 바닥에서 매수' },
  { rank: 2, name: '감정부자', yield: 1890, note: '"짜증" 월요일 아침에 올인' },
  { rank: 3, name: '너_', yield: 856, note: '"행복" 꾸준히 매수' },
  { rank: 4, name: '행복한토끼', yield: 512, note: '"평온" 장기 홀딩' },
  { rank: 5, name: '???', yield: 234, note: '다양한 감정 분산 투자' },
]

export function Leaderboard() {
  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>🏆 오늘의 감정 투자 고수</h3>
      <ol className="leaderboard">
        {MOCK_LEADERS.map((u) => (
          <li key={u.rank}>
            <span>
              <strong>{u.rank}. {u.name}</strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.note}</span>
            </span>
            <span style={{ color: 'var(--up)', fontWeight: 700 }}>+{u.yield}%</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
