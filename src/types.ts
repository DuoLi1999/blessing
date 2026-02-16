export type Relationship = 'elder' | 'junior' | 'colleague' | 'classmate' | 'leader' | 'friend' | 'partner' | 'customer'
export type Style = 'normal' | 'literary' | 'abstract'
export type Length = 'short' | 'medium' | 'long'

export interface ModelInfo {
  id: string
  name: string
  provider: string
}

export interface ApiConfig {
  apiKey: string
  baseUrl: string
  model: string
}

export interface GenerateOptions {
  relationship: Relationship
  style: Style
  length: Length
  name?: string
  note?: string
  reference?: string
}

export interface RelationshipMeta {
  id: Relationship
  label: string
  icon: string
  desc: string
}

export interface StyleMeta {
  id: Style
  label: string
}

export interface LengthMeta {
  id: Length
  label: string
  desc: string
}

export const RELATIONSHIPS: RelationshipMeta[] = [
  { id: 'elder', label: '长辈', icon: '🧓', desc: '恭敬温暖' },
  { id: 'junior', label: '晚辈', icon: '🧒', desc: '亲切关爱' },
  { id: 'colleague', label: '同事', icon: '🤝', desc: '友好默契' },
  { id: 'classmate', label: '同学', icon: '🎓', desc: '青春回忆' },
  { id: 'leader', label: '领导', icon: '💼', desc: '尊重专业' },
  { id: 'friend', label: '朋友', icon: '🎉', desc: '轻松有梗' },
  { id: 'partner', label: '恋人', icon: '❤️', desc: '甜蜜浪漫' },
  { id: 'customer', label: '客户', icon: '🏢', desc: '专业诚恳' },
]

export const STYLES: StyleMeta[] = [
  { id: 'normal', label: '版本一' },
  { id: 'literary', label: '版本二' },
  { id: 'abstract', label: '版本三' },
]

export const LENGTHS: LengthMeta[] = [
  { id: 'short', label: '短句', desc: '<30字' },
  { id: 'medium', label: '中等', desc: '30-50字' },
  { id: 'long', label: '较长', desc: '50-100字' },
]
