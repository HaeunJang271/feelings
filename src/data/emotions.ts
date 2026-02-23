// 12종목 감정 정의 + 타입

export type EmotionCategory = 'positive' | 'negative' | 'neutral'

export interface EmotionDef {
  id: string
  emoji: string
  nameKr: string
  nameEn: string
  category: EmotionCategory
}

export const EMOTIONS: EmotionDef[] = [
  { id: 'happiness', emoji: '😊', nameKr: '행복', nameEn: 'Happiness', category: 'positive' },
  { id: 'excitement', emoji: '💖', nameKr: '설렘', nameEn: 'Excitement', category: 'positive' },
  { id: 'passion', emoji: '🔥', nameKr: '열정', nameEn: 'Passion', category: 'positive' },
  { id: 'pride', emoji: '✨', nameKr: '뿌듯함', nameEn: 'Pride', category: 'positive' },
  { id: 'peace', emoji: '😌', nameKr: '평온', nameEn: 'Peace', category: 'positive' },
  { id: 'anxiety', emoji: '😰', nameKr: '불안', nameEn: 'Anxiety', category: 'negative' },
  { id: 'sadness', emoji: '😔', nameKr: '우울', nameEn: 'Sadness', category: 'negative' },
  { id: 'irritation', emoji: '😡', nameKr: '짜증', nameEn: 'Irritation', category: 'negative' },
  { id: 'fear', emoji: '😱', nameKr: '공포', nameEn: 'Fear', category: 'negative' },
  { id: 'confusion', emoji: '🤔', nameKr: '혼란', nameEn: 'Confusion', category: 'neutral' },
  { id: 'numbness', emoji: '😐', nameKr: '무감정', nameEn: 'Numbness', category: 'neutral' },
  { id: 'mixed', emoji: '🎭', nameKr: '복잡미묘', nameEn: 'Mixed', category: 'neutral' },
]

export const INITIAL_COINS = 1000
export const STORAGE_KEY = 'emotion-exchange-v1'
