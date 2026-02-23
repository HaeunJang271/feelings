# 🎭 감정 거래소 (Emotion Exchange)

> 오늘 네 기분에 올인해봐 — 감정을 주식처럼 사고파는 가상 거래 플랫폼

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

### 리더보드 공유(백엔드) 설정 (선택)

폰/PC 등 **다른 기기·다른 사람**이 같은 리더보드를 보려면 [Supabase](https://supabase.com) 무료 프로젝트를 쓰면 됩니다.

1. [supabase.com](https://supabase.com) → 회원가입 → New Project 생성
2. 프로젝트 **Settings → API**에서 **Project URL**과 **anon public** 키 복사
3. 프로젝트 루트에 `.env` 파일 생성 후 아래 입력:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Supabase 대시보드 **SQL Editor**에서 `supabase-schema.sql` 내용 전체 실행
5. `npm run dev` 다시 실행

설정하지 않으면 리더보드는 기기별 localStorage만 사용합니다.

## 기능 요약

- **실시간 감정 차트**: 12종목(행복, 설렘, 불안, 우울 등) 가격이 2초마다 시뮬레이션 변동
- **이모션 코인**: 첫 접속 시 1,000 코인 지급 → 감정별 매수/매도
- **매수·매도·올인**: 종목별 현재가 기준으로 코인 투자, 올인 버튼 지원
- **포트폴리오**: 보유 종목, 평가 수익률, 거래 히스토리
- **뉴스 피드**: 급등/급락 종목 자동 헤드라인
- **리더보드**: Supabase 연동 시 모든 접속자가 같은 순위 공유 (미설정 시 기기별만)
- **다크 UI**: 글래스모피즘, 상승(녹색)/하락(빨강) 네온 스타일

## 기술 스택

- **React 19** + **TypeScript** + **Vite 7**
- **Framer Motion** — 애니메이션
- **Chart 데이터** — 미니 SVG 라인 차트 (실시간 히스토리)
- **localStorage** — 사용자 포트폴리오·거래 기록 저장

## 프로젝트 구조

```
src/
  data/emotions.ts   # 12종목 정의
  lib/marketEngine.ts # 가격 시뮬레이션
  lib/storage.ts     # localStorage
  hooks/useEmotionMarket.ts # 시장 + 유저 상태
  components/        # EmotionRow, TradeModal, Portfolio, NewsFeed, Leaderboard
  App.tsx
```

## 확장 아이디어

- WebSocket으로 다중 사용자 실시간 동기화
- 감정 뱃지·칭호·이벤트(플래시 크래시, 러시아워)
- 학교/그룹별 비공개 거래소
- 인스타 스토리용 수익률 카드 공유
