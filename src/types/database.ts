export interface Team {
  id: number
  name: string
  code: string
  group_name: string
  flag_emoji: string
  total_stickers: number
}

export interface Sticker {
  id: number
  team_id: number
  number: string
  name: string
  type: 'player' | 'squad_photo' | 'badge' | 'special'
  position: string | null
  is_special: boolean
  album_page: number | null
}

export interface UserCollectionRow {
  id: string
  user_id: string
  sticker_id: number
  quantity: number
  obtained_at: string
}

export interface StickerWithOwnership extends Sticker {
  quantity: number
  team?: Team
}

export interface TeamWithProgress extends Team {
  owned: number
  pct: number
}

export interface GlobalStats {
  owned: number
  total: number
  repeated: number
  missing: number
}
