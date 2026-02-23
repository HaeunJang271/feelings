import { useMemo } from 'react'
import { EMOTIONS } from '../data/emotions'
import type { UserState } from '../types'

interface ReportCardProps {
  user: UserState
}

export function ReportCard({ user }: ReportCardProps) {
  const report = useMemo(() => {
    const history = user.history ?? []
    const totalTrades = history.length
    const portfolioSum = Object.values(user.portfolio).reduce((s, h) => s + h.coins, 0)
    const totalValue = user.coins + portfolioSum
    const totalYield = totalTrades === 0 ? 0 : ((totalValue - 1000) / 1000) * 100
    const sells = history.filter((t) => t.type === 'sell')
    const winRate = sells.length > 0 ? (sells.length / Math.max(1, history.filter((t) => t.type === 'buy').length)) * 100 : 0
    let bestEmotion: string | null = null
    let bestYield = 0
    let worstEmotion: string | null = null
    let worstYield = 0
    Object.entries(user.portfolio).forEach(([id, h]) => {
      const def = EMOTIONS.find((e) => e.id === id)
      if (!def) return
      if (bestYield === 0 || h.coins > bestYield) { bestYield = h.coins; bestEmotion = def.nameKr }
      if (worstYield === 0 || h.coins < worstYield) { worstYield = h.coins; worstEmotion = def.nameKr }
    })
    let style = '거래 전'
    if (totalTrades > 0) {
      if (totalYield > 100) style = '공격적 도박형'
      else if (totalYield > 30) style = '적극 투자형'
      else if (totalYield > 0) style = '꾸준한'
      else style = '도전적'
    }
    const aiComment = totalTrades === 0
      ? '아직 거래 기록이 없어요. 첫 투자를 시작해보세요!'
      : totalYield > 50
        ? '당신은 고위험 고수익을 추구하는 감정 투자 고수입니다.'
        : totalYield > 0
          ? '꾸준한 감정 관리로 수익을 내고 있어요.'
          : '다음엔 분산 투자로 리스크를 줄여보세요!'
    return {
      totalYield,
      bestEmotion,
      bestYield,
      worstEmotion,
      worstYield,
      tradeCount: totalTrades,
      winRate,
      style,
      aiComment,
    }
  }, [user])

  return (
    <div className="card">
      <h3 style={{ margin: '0 0 0.5rem' }}>📊 월간 리포트</h3>
      <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}><span>총 수익률</span><span style={{ color: report.totalYield >= 0 ? 'var(--up)' : 'var(--down)' }}>{report.totalYield >= 0 ? '+' : ''}{report.totalYield.toFixed(0)}%</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}><span>최다 보유</span><span style={{ color: 'var(--up)' }}>{report.bestEmotion ? `${report.bestYield.toLocaleString()}코인 (${report.bestEmotion})` : '-'}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}><span>최소 보유</span><span style={{ color: 'var(--down)' }}>{report.worstEmotion ? `${report.worstYield.toLocaleString()}코인 (${report.worstEmotion})` : '-'}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}><span>거래 횟수</span><span>{report.tradeCount}회</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>승률</span><span>{report.winRate.toFixed(0)}%</span></div>
      </div>
      <p style={{ marginBottom: '0.5rem' }}>투자 스타일: 🎰 &quot;{report.style}&quot;</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>AI 평가: &quot;{report.aiComment}&quot;</p>
      <button
        type="button"
        className="btn-buy"
        onClick={() => {
          const text = `🎭 감정 거래소 리포트\n총 수익률 ${report.totalYield >= 0 ? '+' : ''}${report.totalYield.toFixed(0)}%\n거래 ${report.tradeCount}회 · 승률 ${report.winRate.toFixed(0)}%\n투자 스타일: ${report.style}\n#감정거래소\n\n🔗 https://feelings-delta.vercel.app`
          if (typeof navigator.share === 'function') {
            navigator.share({
              title: '감정 거래소 리포트',
              text,
              url: 'https://feelings-delta.vercel.app',
            }).catch(() => {
              navigator.clipboard.writeText(text).then(() => alert('복사됐어요! 인스타 스토리나 게시물에 붙여넣기 하세요.'))
            })
          } else {
            navigator.clipboard.writeText(text).then(() => alert('복사됐어요! 인스타 스토리나 게시물에 붙여넣기 하세요.'))
          }
        }}
      >
        인스타에 자랑하기
      </button>
    </div>
  )
}
