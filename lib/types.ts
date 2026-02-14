export type Relationship = 'elder' | 'colleague' | 'leader' | 'friend' | 'partner' | 'customer'
export type Style = 'normal' | 'literary' | 'abstract'
export type Length = 'short' | 'medium' | 'long'

export interface GenerateOptions {
  relationship: Relationship
  style: Style
  length: Length
  name?: string
  note?: string
  reference?: string
}

export interface ModelInfo {
  id: string
  name: string
  provider: string
}
