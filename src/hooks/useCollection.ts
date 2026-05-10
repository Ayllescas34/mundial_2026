import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTeamsWithProgress, fetchGlobalStats, fetchTeamStickers,
  fetchRepeatedStickers, fetchMissingStickers, addStickers, removeSticker, searchStickers, getStickerByCorrelativo, getStickerByNumber} from '@/api/stickers'
import { useUser } from './useAuth'

export function useGlobalStats() {
  const user = useUser()
  return useQuery({
    queryKey: ['globalStats', user?.id],
    queryFn: () => fetchGlobalStats(user!.id),
    enabled: !!user,
  })
}

export function useTeamsProgress() {
  const user = useUser()
  return useQuery({
    queryKey: ['teamsProgress', user?.id],
    queryFn: () => fetchTeamsWithProgress(user!.id),
    enabled: !!user,
  })
}

export function useTeamStickers(teamId: number | null) {
  const user = useUser()
  return useQuery({
    queryKey: ['teamStickers', user?.id, teamId],
    queryFn: () => fetchTeamStickers(user!.id, teamId!),
    enabled: !!user && !!teamId,
  })
}

export function useRepeatedStickers() {
  const user = useUser()
  return useQuery({
    queryKey: ['repeated', user?.id],
    queryFn: () => fetchRepeatedStickers(user!.id),
    enabled: !!user,
  })
}

export function useMissingStickers(teamId?: number) {
  const user = useUser()
  return useQuery({
    queryKey: ['missing', user?.id, teamId],
    queryFn: () => fetchMissingStickers(user!.id, teamId),
    enabled: !!user,
  })
}

export function useSearchStickers(query: string) {
  const user = useUser()
  return useQuery({
    queryKey: ['search', user?.id, query],
    queryFn: () => searchStickers(user!.id, query),
    enabled: !!user && query.length >= 2,
  })
}

export function useAddStickers() {
  const user = useUser()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => addStickers(user!.id, ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['globalStats'] })
      qc.invalidateQueries({ queryKey: ['teamsProgress'] })
      qc.invalidateQueries({ queryKey: ['teamStickers'] })
      qc.invalidateQueries({ queryKey: ['repeated'] })
      qc.invalidateQueries({ queryKey: ['missing'] })
    },
  })
}

export function useRemoveSticker() {
  const user = useUser()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => removeSticker(user!.id, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['globalStats'] })
      qc.invalidateQueries({ queryKey: ['teamsProgress'] })
      qc.invalidateQueries({ queryKey: ['teamStickers'] })
      qc.invalidateQueries({ queryKey: ['repeated'] })
      qc.invalidateQueries({ queryKey: ['missing'] })
    },
  })
}

export function useStickerByCorrelativo(correlativo?: number) {
  return useQuery({
    queryKey: ['sticker-correlativo', correlativo],
    queryFn: () => getStickerByCorrelativo(correlativo!),
    enabled: !!correlativo,
  })
}

export function useStickerByNumber(
  number?: string
) {
  return useQuery({
    queryKey: ['sticker-number', number],
    queryFn: () =>
      getStickerByNumber(number!),
    enabled: !!number,
  })
}