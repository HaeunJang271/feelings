import { useMemo } from 'react'

interface MiniChartProps {
  history: number[]
  trend: 'up' | 'down' | 'flat'
  height?: number
  className?: string
}

export function MiniChart({ history, trend, height = 32, className = '' }: MiniChartProps) {
  const path = useMemo(() => {
    if (!history.length) return ''
    const min = Math.min(...history)
    const max = Math.max(...history)
    const range = max - min || 1
    const w = 120
    const h = height - 4
    const points = history.map((v, i) => {
      const x = (i / (history.length - 1)) * w
      const y = h - ((v - min) / range) * h + 2
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }, [history, height])

  const stroke = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#94a3b8'

  return (
    <svg
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 120 ${height}`}
      preserveAspectRatio="none"
      style={{ minWidth: 80 }}
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
