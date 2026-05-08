import { useState } from 'react'

import {
  Package,
  Sparkles,
  RotateCcw,
} from 'lucide-react'

import { useAddStickers } from '@/hooks/useCollection'

import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

import { useAuthStore } from '@/stores/authStore'

import toast from 'react-hot-toast'

import type { Team } from '@/types/database'

export function OpenPackPage() {
  const user = useAuthStore(s => s.user)

  const addMutation = useAddStickers()

  const {
    data: teams,
    isLoading: teamsLoading,
  } = useQuery<Team[]>({
    queryKey: ['teams-list'],

    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .neq('code', 'FWC')
        .order('group_name')
        .order('name')

      if (error) throw error

      return data ?? []
    },

    enabled: !!user,
  })

  const [selectedTeamId, setSelectedTeamId] =
    useState<number | ''>('')

  const [stickerNumber, setStickerNumber] =
    useState('')

  const [loading, setLoading] = useState(false)

  const [packStickers, setPackStickers] =
    useState<
      Array<{
        teamName: string
        flag: string
        number: string
        id: number
        isNew: boolean
      }>
    >([])

  const handleAddSticker = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (
      !selectedTeamId ||
      !stickerNumber ||
      !user
    )
      return

    setLoading(true)

    try {
      const team = teams?.find(
        t => t.id === Number(selectedTeamId)
      )

      if (!team) {
        toast.error('Equipo no encontrado')
        return
      }

      const stickerCode = `${team.code}${stickerNumber}`

      const {
        data: sticker,
        error: sErr,
      } = await supabase
        .from('stickers')
        .select('*')
        .eq('number', stickerCode)
        .single()

      if (sErr || !sticker) {
        toast.error(
          `Estampa ${stickerCode} no existe`
        )
        return
      }

      const { data: existing } = await supabase
        .from('user_collection')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('sticker_id', sticker.id)
        .maybeSingle()

      const isNew =
        !existing || existing.quantity === 0

      setPackStickers(prev => [
        ...prev,
        {
          teamName: team.name,
          flag: team.flag_emoji,
          number: stickerCode,
          id: sticker.id,
          isNew,
        },
      ])

      await addMutation.mutateAsync([
        sticker.id,
      ])

      setStickerNumber('')

      toast.success(
        isNew
          ? `✓ Nueva: ${stickerCode}`
          : `Repetida: ${stickerCode}`
      )
    } catch (err: any) {
      toast.error(
        err.message || 'Error inesperado'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="
        w-full
        max-w-6xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-5
        sm:py-8
        pb-28
        lg:pb-8
        overflow-x-hidden
      "
    >
      {/* HEADER */}
      <div className="mb-6 sm:mb-8 anim-fade">
        <h2
          className="
            font-display
            text-3xl
            sm:text-4xl
            lg:text-5xl
            text-white
            tracking-wide
            mb-2
            leading-tight
          "
        >
          ABRIR SOBRE
        </h2>

        <p
          className="
            text-green-700
            text-xs
            sm:text-sm
            font-body
          "
        >
          Registra las estampas que obtienes
          al abrir un sobre
        </p>
      </div>

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-5
          lg:gap-6
        "
      >
        {/* FORM */}
        <div
          className="
            glass
            rounded-2xl
            sm:rounded-3xl
            p-4
            sm:p-6
            anim-slide-up
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              mb-5
            "
          >
            <Package
              size={18}
              className="text-green-400"
            />

            <h3
              className="
                font-display
                text-lg
                sm:text-xl
                text-white
              "
            >
              AGREGAR ESTAMPA
            </h3>
          </div>

          <form
            onSubmit={handleAddSticker}
            className="space-y-4"
          >
            {/* SELECT */}
            <div>
              <label
                className="
                  block
                  text-xs
                  text-green-700
                  mb-1.5
                  font-body
                "
              >
                Selección{' '}
                {teamsLoading && (
                  <span className="text-green-900">
                    (cargando...)
                  </span>
                )}
              </label>

              <div className="relative">
                <select
                  value={selectedTeamId}
                  onChange={e =>
                    setSelectedTeamId(
                      e.target.value
                        ? Number(
                            e.target.value
                          )
                        : ''
                    )
                  }
                  required
                  className="
                    w-full
                    bg-[#111]
                    border
                    border-green-900/40
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-white
                    focus:outline-none
                    focus:border-green-500/40
                    font-body
                    appearance-none
                    cursor-pointer
                  "
                >
                  <option value="">
                    Elige una selección...
                  </option>

                  {(teams ?? []).map(t => (
                    <option
                      key={t.id}
                      value={t.id}
                    >
                      {t.flag_emoji} {t.name}
                    </option>
                  ))}
                </select>

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-4
                    flex
                    items-center
                    text-green-500
                  "
                >
                  ▼
                </div>
              </div>
            </div>

            {/* INPUT */}
            <div>
              <label
                className="
                  block
                  text-xs
                  text-green-700
                  mb-1.5
                  font-body
                "
              >
                Número de estampa (1–20)
              </label>

              <input
                type="number"
                min="1"
                max="20"
                value={stickerNumber}
                onChange={e =>
                  setStickerNumber(
                    e.target.value
                  )
                }
                placeholder="ej: 5"
                required
                className="
                  w-full
                  bg-[#111]
                  border
                  border-green-900/40
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-white
                  placeholder-green-900
                  focus:outline-none
                  focus:border-green-500/40
                  font-body
                "
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={
                loading ||
                !selectedTeamId ||
                !stickerNumber
              }
              className="
                w-full
                py-3
                rounded-xl
                bg-green-500/15
                border
                border-green-500/30
                text-green-300
                hover:bg-green-500/25
                transition-all
                text-sm
                font-body
                disabled:opacity-40
              "
            >
              {loading
                ? 'Agregando...'
                : '+ Agregar estampa'}
            </button>
          </form>

          {/* CLEAR */}
          {packStickers.length > 0 && (
            <button
              onClick={() =>
                setPackStickers([])
              }
              className="
                w-full
                mt-3
                py-2
                rounded-xl
                text-xs
                text-green-800
                hover:text-green-600
                flex
                items-center
                justify-center
                gap-1.5
                transition-colors
                font-body
              "
            >
              <RotateCcw size={12} />
              Limpiar lista
            </button>
          )}
        </div>

        {/* LIVE FEED */}
        <div
          className="
            glass
            rounded-2xl
            sm:rounded-3xl
            p-4
            sm:p-6
            anim-slide-up
          "
          style={{
            animationDelay: '100ms',
          }}
        >
          <div
            className="
              flex
              items-center
              gap-2
              mb-4
            "
          >
            <Sparkles
              size={18}
              className="text-yellow-400"
            />

            <h3
              className="
                font-display
                text-lg
                sm:text-xl
                text-white
              "
            >
              ESTAMPAS AGREGADAS
            </h3>
          </div>

          {packStickers.length === 0 ? (
            <div
              className="
                text-center
                py-10
                sm:py-12
              "
            >
              <div
                className="
                  text-4xl
                  mb-3
                  opacity-30
                "
              >
                📦
              </div>

              <p
                className="
                  text-green-800
                  text-sm
                  font-body
                "
              >
                Agrega estampas para verlas aquí
              </p>
            </div>
          ) : (
            <div
              className="
                space-y-2
                max-h-[420px]
                overflow-y-auto
                pr-1
              "
            >
              {[...packStickers]
                .reverse()
                .map((s, i) => (
                  <div
                    key={i}
                    className={`
                      flex
                      items-center
                      gap-3
                      p-3
                      rounded-xl
                      anim-pop
                      ${
                        s.isNew
                          ? 'bg-green-900/30 border border-green-500/20'
                          : 'bg-yellow-900/20 border border-yellow-500/15'
                      }
                    `}
                  >
                    <span
                      className="
                        text-lg
                        sm:text-xl
                        flex-shrink-0
                      "
                    >
                      {s.flag}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p
                        className="
                          text-xs
                          font-mono
                          text-white/80
                          truncate
                        "
                      >
                        {s.number}
                      </p>

                      <p
                        className="
                          text-[10px]
                          text-green-700
                          font-body
                          truncate
                        "
                      >
                        {s.teamName}
                      </p>
                    </div>

                    <span
                      className={`
                        text-[10px]
                        font-body
                        px-2
                        py-1
                        rounded-full
                        whitespace-nowrap
                        ${
                          s.isNew
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }
                      `}
                    >
                      {s.isNew
                        ? 'Nueva ✓'
                        : 'Repetida'}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {/* FOOTER */}
          {packStickers.length > 0 && (
            <div
              className="
                mt-4
                pt-4
                border-t
                border-white/5
                flex
                items-center
                justify-between
                text-xs
                font-body
                gap-3
              "
            >
              <span className="text-green-500">
                {
                  packStickers.filter(
                    s => s.isNew
                  ).length
                }{' '}
                nuevas
              </span>

              <span className="text-yellow-500">
                {
                  packStickers.filter(
                    s => !s.isNew
                  ).length
                }{' '}
                repetidas
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}