import { supabase } from '@/lib/supabase'
import type { Team, TeamWithProgress } from '@/types/database'

export async function fetchTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('group_name', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchTeamById(id: number): Promise<Team | null> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function fetchTeamsWithProgress(userId: string): Promise<TeamWithProgress[]> {
  // Fetch all teams
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('*')
    .order('group_name')
    .order('name')

  if (teamsError) throw teamsError

  // Fetch user collection grouped by team
  const { data: collection, error: colError } = await supabase
    .from('user_collection')
    .select('sticker_id, quantity, stickers!inner(team_id)')
    .eq('user_id', userId)
    .gt('quantity', 0)

  if (colError) throw colError

  // Build a map: team_id → owned count
  const ownedByTeam: Record<number, number> = {}
  for (const row of collection ?? []) {
    const teamId = (row.stickers as { team_id: number }[])[0]?.team_id
    ownedByTeam[teamId] = (ownedByTeam[teamId] ?? 0) + 1
  }

  return (teams ?? []).map((team) => {
    const owned = ownedByTeam[team.id] ?? 0
    return {
      ...team,
      owned,
      pct: Math.round((owned / team.total_stickers) * 100),
    }
  })
}
