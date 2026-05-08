import {
  useRepeatedStickers,
  useRemoveSticker,
} from '@/hooks/useCollection'

import {
  Copy,
  Minus,
} from 'lucide-react'

import toast from 'react-hot-toast'

export function RepeatedPage() {
  const {
    data: stickers,
    isLoading,
  } = useRepeatedStickers()

  const removeMutation =
    useRemoveSticker()

  const handleRemoveOne = async (
    id: number
  ) => {
    await removeMutation.mutateAsync(id)

    toast('Una repetida removida', {
      icon: '↩️',
    })
  }

  const byTeam = (
    stickers ?? []
  ).reduce<Record<string, typeof stickers>>(
    (acc, s) => {
      const key =
        s.team?.name ?? 'Sin equipo'

      acc[key] = [
        ...(acc[key] ?? []),
        s,
      ]

      return acc
    },
    {}
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
          REPETIDAS
        </h2>

        <p
          className="
            text-green-700
            text-xs
            sm:text-sm
            font-body
          "
        >
          {stickers?.length ?? 0} tipos de
          estampas con más de una copia
        </p>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >
          {Array.from({
            length: 6,
          }).map((_, i) => (
            <div
              key={i}
              className="
                glass
                rounded-2xl
                p-5
                h-24
                animate-pulse
              "
            />
          ))}
        </div>
      ) : stickers?.length === 0 ? (
        /* EMPTY */
        <div
          className="
            glass
            rounded-2xl
            sm:rounded-3xl
            p-8
            sm:p-16
            text-center
          "
        >
          <div
            className="
              text-4xl
              sm:text-5xl
              mb-4
            "
          >
            🎉
          </div>

          <h3
            className="
              font-display
              text-2xl
              sm:text-3xl
              text-white
              mb-2
            "
          >
            ¡SIN REPETIDAS!
          </h3>

          <p
            className="
              text-green-700
              font-body
              text-sm
            "
          >
            No tienes estampas repetidas
            por ahora
          </p>
        </div>
      ) : (
        /* CONTENT */
        <div className="space-y-5 sm:space-y-6">
          {Object.entries(byTeam).map(
            ([teamName, teamStickers]) => {
              const team =
                teamStickers[0]?.team

              return (
                <div
                  key={teamName}
                  className="
                    glass
                    rounded-2xl
                    p-4
                    sm:p-5
                    anim-slide-up
                  "
                >
                  {/* TEAM HEADER */}
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                      mb-4
                    "
                  >
                    <span
                      className="
                        text-xl
                        sm:text-2xl
                      "
                    >
                      {team?.flag_emoji}
                    </span>

                    <h3
                      className="
                        font-display
                        text-lg
                        sm:text-xl
                        text-white
                        break-words
                      "
                    >
                      {teamName}
                    </h3>

                    <span
                      className="
                        sm:ml-auto
                        text-[10px]
                        sm:text-xs
                        font-mono
                        text-yellow-600
                        bg-yellow-900/30
                        px-2
                        py-1
                        rounded-full
                        whitespace-nowrap
                      "
                    >
                      {
                        teamStickers.length
                      }{' '}
                      tipos repetidos
                    </span>
                  </div>

                  {/* STICKERS */}
                  <div className="space-y-2">
                    {teamStickers.map(
                      s => (
                        <div
                          key={s.id}
                          className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            gap-3
                            bg-yellow-900/10
                            border
                            border-yellow-900/30
                            rounded-xl
                            px-4
                            py-3
                          "
                        >
                          {/* LEFT */}
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              min-w-0
                              flex-1
                            "
                          >
                            <Copy
                              size={14}
                              className="text-yellow-600 flex-shrink-0"
                            />

                            <div className="min-w-0">
                              <p
                                className="
                                  text-xs
                                  font-mono
                                  text-yellow-400
                                  truncate
                                "
                              >
                                {s.number}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-green-700
                                  font-body
                                  truncate
                                "
                              >
                                {s.name}
                              </p>
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              sm:justify-end
                              gap-2
                              sm:gap-3
                              flex-wrap
                            "
                          >
                            <span
                              className="
                                text-[10px]
                                sm:text-xs
                                text-yellow-500
                                font-mono
                                bg-yellow-900/30
                                px-2
                                py-1
                                rounded-full
                                whitespace-nowrap
                              "
                            >
                              ×{s.quantity}
                            </span>

                            <span
                              className="
                                text-[10px]
                                sm:text-xs
                                text-yellow-700
                                font-body
                                whitespace-nowrap
                              "
                            >
                              {s.quantity - 1}{' '}
                              de sobra
                            </span>

                            <button
                              onClick={() =>
                                handleRemoveOne(
                                  s.id
                                )
                              }
                              className="
                                w-8
                                h-8
                                rounded-lg
                                bg-red-900/20
                                border
                                border-red-900/30
                                text-red-500
                                hover:bg-red-900/40
                                flex
                                items-center
                                justify-center
                                transition-colors
                                flex-shrink-0
                              "
                              title="Quitar una copia"
                            >
                              <Minus
                                size={12}
                              />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            }
          )}
        </div>
      )}
    </div>
  )
}