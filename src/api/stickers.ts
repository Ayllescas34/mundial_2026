import { supabase } from '@/lib/supabase'
import type { StickerWithOwnership, TeamWithProgress, GlobalStats } from '@/types/database'

export async function fetchTeamsWithProgress(userId: string): Promise<TeamWithProgress[]> {
  const { data: teams, error: e1 } = await supabase
    .from('teams').select('*').order('group_name').order('name')
  if (e1) throw e1

  const { data: col, error: e2 } = await supabase
    .from('user_collection')
    .select('sticker_id, quantity, stickers!inner(team_id)')
    .eq('user_id', userId).gt('quantity', 0)
  if (e2) throw e2

  const ownedByTeam: Record<number, number> = {}

  for (const row of col ?? []) {
    const sticker = row.stickers as unknown as { team_id: number }

    if (!sticker?.team_id) continue

    ownedByTeam[sticker.team_id] =
      (ownedByTeam[sticker.team_id] ?? 0) + 1
  }

  return (teams ?? []).map((team) => {
    const owned = ownedByTeam[team.id] ?? 0
    return { ...team, owned, pct: Math.round((owned / team.total_stickers) * 100) }
  })
}

export async function fetchGlobalStats(userId: string): Promise<GlobalStats> {
  const { data: totalTeams } = await supabase.from('teams').select('total_stickers')
  const total = (totalTeams ?? []).reduce((s, t) => s + t.total_stickers, 0)

  const { data: col, error } = await supabase
    .from('user_collection')
    .select('quantity')
    .eq('user_id', userId).gt('quantity', 0)
  if (error) throw error

  const owned = (col ?? []).length
  const repeated = (col ?? []).filter(r => r.quantity > 1).length
  return { owned, total, repeated, missing: total - owned }
}

export async function fetchTeamStickers(userId: string, teamId: number): Promise<StickerWithOwnership[]> {
  const { data: stickers, error: e1 } = await supabase
    .from('stickers').select('*').eq('team_id', teamId).order('number')
  if (e1) throw e1

  const stickerIds = (stickers ?? []).map(s => s.id)
  const { data: col, error: e2 } = await supabase
    .from('user_collection')
    .select('sticker_id, quantity')
    .eq('user_id', userId)
    .in('sticker_id', stickerIds)
  if (e2) throw e2

  const qtyMap: Record<number, number> = {}
  for (const row of col ?? []) qtyMap[row.sticker_id] = row.quantity

  return (stickers ?? []).map(s => ({ ...s, quantity: qtyMap[s.id] ?? 0 }))
}

export async function fetchRepeatedStickers(userId: string): Promise<StickerWithOwnership[]> {
  const { data, error } = await supabase
    .from('user_collection')
    .select('sticker_id, quantity, stickers!inner(*, teams!inner(*))')
    .eq('user_id', userId).gt('quantity', 1)
    .order('quantity', { ascending: false })
  if (error) throw error

  return (data ?? []).map((row: any) => ({
    ...row.stickers,
    team: row.stickers.teams,
    quantity: row.quantity,
  }))
}

export async function fetchMissingStickers(userId: string, teamId?: number): Promise<StickerWithOwnership[]> {
  // Get all stickers (optionally filtered by team)
  let query = supabase.from('stickers').select('*, teams!inner(*)')
  if (teamId) query = query.eq('team_id', teamId)
  const { data: allStickers, error: e1 } = await query
  if (e1) throw e1

  const ids = (allStickers ?? []).map(s => s.id)
  if (!ids.length) return []

  const { data: col, error: e2 } = await supabase
    .from('user_collection')
    .select('sticker_id, quantity')
    .eq('user_id', userId)
    .in('sticker_id', ids)
    .gt('quantity', 0)
  if (e2) throw e2

  const ownedIds = new Set((col ?? []).map(r => r.sticker_id))
  return (allStickers ?? [])
    .filter(s => !ownedIds.has(s.id))
    .map(s => ({ ...s, quantity: 0, team: (s as any).teams }))
}

export async function addStickers(userId: string, stickerIds: number[]): Promise<void> {
  // Upsert: increase quantity if already owned
  for (const sid of stickerIds) {
    const { data: existing } = await supabase
      .from('user_collection')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('sticker_id', sid)
      .single()

    if (existing) {
      await supabase
        .from('user_collection')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('user_collection')
        .insert({ user_id: userId, sticker_id: sid, quantity: 1 })
    }
  }
}

export async function removeSticker(userId: string, stickerId: number): Promise<void> {
  const { data: existing } = await supabase
    .from('user_collection')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('sticker_id', stickerId)
    .single()

  if (!existing) return
  if (existing.quantity <= 1) {
    await supabase.from('user_collection').delete().eq('id', existing.id)
  } else {
    await supabase.from('user_collection')
      .update({ quantity: existing.quantity - 1 })
      .eq('id', existing.id)
  }
}

export async function searchStickers(userId: string, query: string): Promise<StickerWithOwnership[]> {
  const { data, error } = await supabase
    .from('stickers')
    .select('*, teams!inner(*)')
    .or(`name.ilike.%${query}%,number.ilike.%${query}%`)
    .limit(30)
  if (error) throw error

  const ids = (data ?? []).map(s => s.id)
  const { data: col } = await supabase
    .from('user_collection')
    .select('sticker_id, quantity')
    .eq('user_id', userId)
    .in('sticker_id', ids)

  const qtyMap: Record<number, number> = {}
  for (const row of col ?? []) qtyMap[row.sticker_id] = row.quantity
  return (data ?? []).map(s => ({ ...s, quantity: qtyMap[s.id] ?? 0, team: (s as any).teams }))
}

export async function getStickerByCorrelativo(correlativo: number) {
  const { data, error } = await supabase
    .from('stickers')
    .select('*')
    .eq('correlativo', correlativo)
    .single()

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export async function getStickerByNumber(
  number: string
) {
  const { data, error } = await supabase
    .from('stickers')
    .select(`
      *,
      team:teams(*)
    `)
    .eq('number', number.toUpperCase())
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}


