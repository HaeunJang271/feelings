import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEmotionMarket } from './hooks/useEmotionMarket'
import { EMOTIONS } from './data/emotions'
import { EmotionRow } from './components/EmotionRow'
import { TradeModal } from './components/TradeModal'
import { Portfolio } from './components/Portfolio'
import { NewsFeed } from './components/NewsFeed'
import { Leaderboard } from './components/Leaderboard'

type Tab = 'chart' | 'portfolio' | 'news' | 'leaderboard'

function App() {
  const { quotes, user, initUser, buy, sell, getEmotionDef } = useEmotionMarket()
  const [tab, setTab] = useState<Tab>('chart')
  const [modal, setModal] = useState<{
    emotionId: string
    type: 'buy' | 'sell'
  } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const handleBuy = useCallback(
    (emotionId: string) => setModal({ emotionId, type: 'buy' }),
    []
  )
  const handleSell = useCallback(
    (emotionId: string) => setModal({ emotionId, type: 'sell' }),
    []
  )

  const handleConfirmTrade = useCallback(
    (amount: number) => {
      if (!modal) return false
      const ok = modal.type === 'buy' ? buy(modal.emotionId, amount) : sell(modal.emotionId, amount)
      if (ok) {
        const name = getEmotionDef(modal.emotionId)?.nameKr
        setToast(modal.type === 'buy' ? `💥 ${name}에 ${amount.toLocaleString()}코인 투자 완료!` : `📤 ${name} ${amount.toLocaleString()}코인 매도 완료!`)
        setTimeout(() => setToast(null), 2500)
        setModal(null)
        return true
      }
      return false
    },
    [modal, buy, sell, getEmotionDef]
  )

  const handleOnboardingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('nickname') as HTMLInputElement)?.value?.trim()
    initUser(name || '익명의 투자자')
  }

  if (!user) {
    return (
      <div className="onboarding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>🎭 감정 거래소</h1>
          <p>오늘 네 기분에 올인해봐. 1,000 이모션 코인을 드려요!</p>
          <form onSubmit={handleOnboardingSubmit}>
            <input
              name="nickname"
              type="text"
              placeholder="닉네임 (선택)"
              maxLength={20}
            />
            <button type="submit">시작하기</button>
          </form>
        </motion.div>
      </div>
    )
  }

  const def = modal ? getEmotionDef(modal.emotionId) : null
  const quote = modal ? quotes.find((q) => q.id === modal.emotionId) : null
  const holding = modal ? user.portfolio[modal.emotionId] : null

  return (
    <>
      <header className="app-header">
        <div className="app-title">
          <span className="live">🔴 LIVE</span>
          <span>감정 거래소</span>
        </div>
        <div className="user-bar">
          <span className="coin-badge">💰 {Math.floor(user.coins).toLocaleString()} 코인</span>
          <nav className="nav-tabs">
            {(['chart', 'portfolio', 'news', 'leaderboard'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={tab === t ? 'active' : ''}
                onClick={() => setTab(t)}
              >
                {t === 'chart' && '차트'}
                {t === 'portfolio' && '포트폴리오'}
                {t === 'news' && '뉴스'}
                {t === 'leaderboard' && '리더보드'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {tab === 'chart' && (
        <motion.div
          key="chart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="card"
        >
          {EMOTIONS.map((def) => {
            const quote = quotes.find((q) => q.id === def.id)
            if (!quote) return null
            return (
              <EmotionRow
                key={def.id}
                def={def}
                quote={quote}
                onBuy={() => handleBuy(def.id)}
                onSell={() => handleSell(def.id)}
                hasHoldings={!!user.portfolio[def.id]?.coins}
              />
            )
          })}
        </motion.div>
      )}

      {tab === 'portfolio' && <Portfolio user={user} quotes={quotes} />}
      {tab === 'news' && <NewsFeed quotes={quotes} />}
      {tab === 'leaderboard' && <Leaderboard />}

      {def && quote && modal && (
        <TradeModal
          isOpen={!!modal}
          type={modal.type}
          def={def}
          quote={quote}
          userCoins={user.coins}
          holdingCoins={holding?.coins ?? 0}
          onConfirm={handleConfirmTrade}
          onClose={() => setModal(null)}
        />
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-card)',
            border: '1px solid var(--up)',
            color: 'var(--up-bright)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius)',
            fontWeight: 700,
            boxShadow: '0 0 24px rgba(34, 197, 94, 0.3)',
            zIndex: 300,
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
