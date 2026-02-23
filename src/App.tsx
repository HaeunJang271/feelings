import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEmotionMarket } from './hooks/useEmotionMarket'
import { EMOTIONS } from './data/emotions'
import { EmotionRow } from './components/EmotionRow'
import { TradeModal } from './components/TradeModal'
import { Portfolio } from './components/Portfolio'
import { NewsFeed } from './components/NewsFeed'
import { Leaderboard } from './components/Leaderboard'
import { GachaPanel } from './components/GachaPanel'
import { Lotto } from './components/Lotto'
import { Attendance } from './components/Attendance'
import { Achievements } from './components/Achievements'
import { ReportCard } from './components/ReportCard'
import { Heatmap } from './components/Heatmap'
import { ACHIEVEMENTS } from './data/achievements'

type Tab = 'chart' | 'portfolio' | 'news' | 'leaderboard' | 'gacha' | 'lotto' | 'rewards' | 'report' | 'heatmap'

function App() {
  const {
    quotes,
    user,
    initUser,
    buy,
    sell,
    getEmotionDef,
    gachaPull,
    attendanceCheck,
    unlockAchievement,
    buyLottoTicket,
    drawLotto,
  } = useEmotionMarket()
  const [tab, setTab] = useState<Tab>('chart')
  const [headerOpen, setHeaderOpen] = useState(false)
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
        if (user && user.history.length === 0) unlockAchievement('first_trade')
        const name = getEmotionDef(modal.emotionId)?.nameKr
        setToast(modal.type === 'buy' ? `💥 ${name}에 ${amount.toLocaleString()}코인 투자 완료!` : `📤 ${name} ${amount.toLocaleString()}코인 매도 완료!`)
        setTimeout(() => setToast(null), 2500)
        setModal(null)
        return true
      }
      return false
    },
    [modal, buy, sell, getEmotionDef, user, unlockAchievement]
  )

  const handleOnboardingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('nickname') as HTMLInputElement)?.value?.trim()
    initUser(name || '익명의 투자자')
  }

  useEffect(() => {
    if (!user) return
    if (user.coins === 0) unlockAchievement('bankruptcy')
    if (user.coins >= 10000) unlockAchievement('coin_10k')
  }, [user?.coins, unlockAchievement])

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
      <header className={`app-header ${headerOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          className="app-header-toggle"
          onClick={() => setHeaderOpen((o) => !o)}
          aria-expanded={headerOpen}
          aria-label={headerOpen ? '메뉴 접기' : '메뉴 펼치기'}
        >
          <div className="app-title">
            <span className="live">🔴 LIVE</span>
            <span>감정 거래소</span>
          </div>
          <span className="coin-badge">💰 {Math.floor(user.coins).toLocaleString()}</span>
          <span className="header-chevron">{headerOpen ? '▲' : '▼'}</span>
        </button>
        <div className="app-header-content">
          <div className="app-header-content-inner">
          <nav className="nav-tabs" style={{ flexWrap: 'wrap', gap: '0.25rem', maxWidth: '100%' }}>
            {(
              [
                ['chart', '차트'],
                ['portfolio', '포트폴리오'],
                ['news', '뉴스'],
                ['leaderboard', '리더보드'],
                ['gacha', '가챠'],
                ['lotto', '복권'],
                ['rewards', '리워드'],
                ['report', '리포트'],
                ['heatmap', '히트맵'],
              ] as [Tab, string][]
            ).map(([t, label]) => (
              <button
                key={t}
                type="button"
                className={tab === t ? 'active' : ''}
                onClick={() => setTab(t)}
              >
                {label}
              </button>
            ))}
          </nav>
          </div>
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
      {tab === 'leaderboard' && <Leaderboard user={user} quotes={quotes} />}
      {tab === 'gacha' && (
        <GachaPanel
          coins={user.coins}
          gachaTickets={user.gachaTickets ?? 0}
          gachaPity={user.gachaPity ?? 0}
          onPull={(c) => gachaPull(c) ?? null}
          onLegend={() => unlockAchievement('legend_gacha')}
        />
      )}
      {tab === 'lotto' && (
        <Lotto
          coins={user.coins}
          tickets={user.lottoTickets ?? []}
          onBuy={buyLottoTicket}
          onDraw={drawLotto}
        />
      )}
      {tab === 'rewards' && (
        <>
          <Attendance
            streak={user.attendance?.streak ?? 0}
            checkedDates={user.attendance?.checkedDates}
            onCheck={attendanceCheck}
          />
          <Achievements user={user} totalAchievements={ACHIEVEMENTS.length} />
        </>
      )}
      {tab === 'report' && <ReportCard user={user} />}
      {tab === 'heatmap' && <Heatmap quotes={quotes} />}

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
