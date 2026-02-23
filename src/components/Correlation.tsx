// 목업: 설렘 ↑ 일 때 연관 감정
const MOCK_CORRELATIONS = [
  { name: '행복', change: 85, type: 'up' },
  { name: '불안', change: -40, type: 'down' },
  { name: '평온', change: -20, type: 'down' },
]

export function Correlation() {
  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.5rem' }}>🔗 연관 감정 분석</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        &quot;설렘&quot; ↑ 할 때:
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
        {MOCK_CORRELATIONS.map((c) => (
          <li key={c.name} style={{ marginBottom: '0.35rem' }}>
            &quot;{c.name}&quot; {c.change >= 0 ? '+' : ''}{c.change}% {c.type === 'up' ? '동반 상승' : '하락'}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: '1rem', color: 'var(--up-bright)', fontSize: '0.9rem' }}>
        💡 투자 팁: 설렘 오를 때 행복도 같이 사라!
      </p>
    </div>
  )
}
