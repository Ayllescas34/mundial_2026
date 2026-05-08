import {
  useParams,
  Link,
} from 'react-router-dom'

import {
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react'

import {
  useTeamStickers,
  useTeamsProgress,
  useAddStickers,
  useRemoveSticker,
} from '@/hooks/useCollection'

import { StickerChip } from '@/components/ui/StickerChip'

import { ProgressRing } from '@/components/ui/ProgressRing'

import toast from 'react-hot-toast'

export function TeamDetailPage() {
  const { id } = useParams<{
    id: string
  }>()

  const teamId = Number(id)

  const {
    data: stickers,
    isLoading,
  } = useTeamStickers(teamId)

  const { data: teams } =
    useTeamsProgress()

  const addMutation =
    useAddStickers()

  const removeMutation =
    useRemoveSticker()

  const team = teams?.find(
    t => t.id === teamId
  )

  const handleStickerClick = async (
    stickerId: number,
    currentQty: number
  ) => {
    if (currentQty === 0) {
      await addMutation.mutateAsync([
        stickerId,
      ])

      toast.success(
        '¡Estampa agregada!',
        {
          icon: '✅',
        }
      )
    } else {
      await removeMutation.mutateAsync(
        stickerId
      )

      toast('Estampa removida', {
        icon: '↩️',
      })
    }
  }

  const owned =
    stickers?.filter(
      s => s.quantity > 0
    ).length ?? 0

  const repeated =
    stickers?.filter(
      s => s.quantity > 1
    ).length ?? 0

  const pct = team
    ? Math.round(
        (owned /
          team.total_stickers) *
          100
      )
    : 0

  const byType = stickers?.reduce<
    Record<string, typeof stickers>
  >((acc, s) => {
    const key =
      s.type === 'player'
        ? s.position ?? 'Jugador'
        : s.type === 'badge'
        ? 'Escudo'
        : s.type ===
          'squad_photo'
        ? 'Foto Grupal'
        : 'Especial'

    acc[key] = [
      ...(acc[key] ?? []),
      s,
    ]

    return acc
  }, {})

  const typeOrder = [
    'Escudo',
    'Foto Grupal',
    'Portero',
    'Defensa',
    'Mediocampo',
    'Delantero',
    'Especial',
  ]

  const sortedTypes = Object.entries(
    byType ?? {}
  ).sort(
    ([a], [b]) =>
      (typeOrder.indexOf(a) + 1 ||
        99) -
      (typeOrder.indexOf(b) + 1 ||
        99)
  )

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
      {/* BACK */}
      <Link
        to="/selecciones"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          text-green-700
          hover:text-green-400
          mb-6
          font-body
          transition-colors
        "
      >
        <ArrowLeft size={14} />
        Volver a selecciones
      </Link>

      {/* HERO */}
      {team && (
        <div
          className="
            glass-gold
            rounded-2xl
            sm:rounded-3xl
            p-5
            sm:p-8
            mb-8
            flex
            flex-col
            lg:flex-row
            items-center
            gap-6
            anim-slide-up
          "
        >
          {/* FLAG */}
          <span
            className="
              text-5xl
              sm:text-6xl
              flex-shrink-0
            "
          >
            {team.flag_emoji}
          </span>

          {/* INFO */}
          <div
            className="
              flex-1
              text-center
              lg:text-left
              min-w-0
            "
          >
            <h2
              className="
                font-display
                text-3xl
                sm:text-4xl
                lg:text-5xl
                text-white
                break-words
                leading-tight
              "
            >
              {team.name.toUpperCase()}
            </h2>

            <p
              className="
                text-yellow-700
                text-xs
                sm:text-sm
                font-mono
                mt-1
              "
            >
              {team.group_name}
            </p>

            {/* STATS */}
            <div
              className="
                flex
                flex-wrap
                justify-center
                lg:justify-start
                gap-3
                sm:gap-4
                mt-4
                text-xs
                sm:text-sm
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-1
                  text-green-400
                "
              >
                <CheckCircle size={14} />
                {owned} tengo
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-1
                  text-yellow-500
                "
              >
                <CheckCircle size={14} />
                {repeated} repetidas
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-1
                  text-red-500
                "
              >
                <XCircle size={14} />
                {(team?.total_stickers ??
                  0) - owned}{' '}
                faltan
              </span>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="relative flex-shrink-0">
            <div className="scale-90 sm:scale-100">
              <ProgressRing
                pct={pct}
                size={100}
                stroke={7}
                color={
                  pct === 100
                    ? '#fbbf24'
                    : '#4ade80'
                }
              />
            </div>

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <span
                className="
                  font-display
                  text-xl
                  sm:text-2xl
                  text-white
                "
              >
                {pct}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* LEGEND */}
      <div
        className="
          flex
          flex-wrap
          gap-3
          sm:gap-4
          mb-4
          text-xs
          font-body
        "
      >
        <span
          className="
            flex
            items-center
            gap-1.5
            text-green-500
          "
        >
          <span
            className="
              w-3
              h-3
              rounded
              bg-green-900/50
              border
              border-green-500/30
              inline-block
            "
          />
          Tengo
        </span>

        <span
          className="
            flex
            items-center
            gap-1.5
            text-yellow-500
          "
        >
          <span
            className="
              w-3
              h-3
              rounded
              bg-yellow-900/40
              border
              border-yellow-500/40
              inline-block
            "
          />
          Repetida
        </span>

        <span
          className="
            flex
            items-center
            gap-1.5
            text-white/20
          "
        >
          <span
            className="
              w-3
              h-3
              rounded
              bg-pitch-900/60
              border
              border-white/5
              inline-block
            "
          />
          Falta
        </span>
      </div>

      <p
        className="
          text-xs
          text-green-800
          mb-6
          font-body
        "
      >
        Click en una estampa para
        marcarla como tenida o quitarla
      </p>

      {/* LOADING */}
      {isLoading ? (
        <div
          className="
            grid
            grid-cols-4
            sm:grid-cols-6
            md:grid-cols-8
            gap-2
          "
        >
          {Array.from({
            length: 20,
          }).map((_, i) => (
            <div
              key={i}
              className="
                w-10
                h-10
                rounded-lg
                bg-white/5
                animate-pulse
              "
            />
          ))}
        </div>
      ) : (
        /* CONTENT */
        <div className="space-y-5 sm:space-y-6">
          {sortedTypes.map(
            ([typeName, typeStickers]) => (
              <div
                key={typeName}
                className="
                  glass
                  rounded-2xl
                  p-4
                  sm:p-5
                "
              >
                <h4
                  className="
                    text-xs
                    text-green-600
                    font-mono
                    uppercase
                    tracking-widest
                    mb-3
                    break-words
                  "
                >
                  {typeName}
                </h4>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {typeStickers.map(
                    s => (
                      <StickerChip
                        key={s.id}
                        sticker={s}
                        onClick={() =>
                          handleStickerClick(
                            s.id,
                            s.quantity
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}