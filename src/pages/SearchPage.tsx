import { useState } from 'react'

import {
  Search,
  Plus,
  Minus,
} from 'lucide-react'

import {
  useSearchStickers,
  useAddStickers,
  useRemoveSticker,
} from '@/hooks/useCollection'

import toast from 'react-hot-toast'

import { clsx } from 'clsx'

export function SearchPage() {
  const [query, setQuery] =
    useState('')

  const {
    data: results,
    isLoading,
  } = useSearchStickers(query)

  const addMutation =
    useAddStickers()

  const removeMutation =
    useRemoveSticker()

  const handleAdd = async (
    id: number
  ) => {
    await addMutation.mutateAsync([id])

    toast.success('Estampa agregada')
  }

  const handleRemove = async (
    id: number
  ) => {
    await removeMutation.mutateAsync(id)

    toast('Estampa removida', {
      icon: '↩️',
    })
  }

  return (
    <div
      className="
        w-full
        max-w-5xl
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
          BUSCAR
        </h2>

        <p
          className="
            text-green-700
            text-xs
            sm:text-sm
            font-body
          "
        >
          Busca estampas por nombre,
          número o selección
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-green-700
          "
        />

        <input
          value={query}
          onChange={e =>
            setQuery(e.target.value)
          }
          placeholder="Busca por número, jugador o posición..."
          className="
            w-full
            bg-white/5
            border
            border-green-900/40
            rounded-2xl
            pl-12
            pr-4
            py-3
            sm:py-4
            text-sm
            text-white
            placeholder-green-900
            focus:outline-none
            focus:border-green-500/40
            font-body
          "
          autoFocus
        />
      </div>

      {/* EMPTY SEARCH */}
      {query.length < 2 ? (
        <div
          className="
            text-center
            py-14
            sm:py-16
            anim-fade
          "
        >
          <div
            className="
              text-4xl
              mb-3
              opacity-20
            "
          >
            🔍
          </div>

          <p
            className="
              text-green-800
              font-body
              text-sm
            "
          >
            Escribe al menos 2 caracteres
            para buscar
          </p>
        </div>
      ) : isLoading ? (
        /* LOADING */
        <div className="space-y-2">
          {Array.from({
            length: 5,
          }).map((_, i) => (
            <div
              key={i}
              className="
                glass
                rounded-xl
                h-16
                animate-pulse
              "
            />
          ))}
        </div>
      ) : results?.length === 0 ? (
        /* NO RESULTS */
        <div
          className="
            text-center
            py-16
          "
        >
          <p
            className="
              text-green-700
              font-body
              text-sm
              break-words
            "
          >
            No se encontraron estampas
            para "{query}"
          </p>
        </div>
      ) : (
        /* RESULTS */
        <div className="space-y-2">
          {results?.map((s, i) => {
            const status =
              s.quantity === 0
                ? 'missing'
                : s.quantity === 1
                ? 'owned'
                : 'repeated'

            return (
              <div
                key={s.id}
                className={clsx(
                  `
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    gap-3
                    p-4
                    rounded-xl
                    border
                    transition-all
                    anim-slide-up
                  `,
                  status === 'missing' &&
                    'glass border-white/5',

                  status === 'owned' &&
                    'bg-green-900/20 border-green-500/20',

                  status === 'repeated' &&
                    'bg-yellow-900/10 border-yellow-900/30'
                )}
                style={{
                  animationDelay: `${i * 30}ms`,
                }}
              >
                {/* TOP */}
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    flex-1
                    min-w-0
                  "
                >
                  <span
                    className="
                      text-lg
                      sm:text-xl
                      flex-shrink-0
                    "
                  >
                    {s.team?.flag_emoji}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          font-mono
                          text-xs
                          text-white/60
                          whitespace-nowrap
                        "
                      >
                        {s.number}
                      </span>

                      <span
                        className="
                          font-body
                          text-sm
                          text-white
                          break-words
                        "
                      >
                        {s.name}
                      </span>
                    </div>

                    <p
                      className="
                        text-xs
                        text-green-700
                        font-body
                        mt-0.5
                        break-words
                      "
                    >
                      {s.team?.name} ·{' '}
                      {s.position ??
                        s.type}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    sm:justify-end
                    gap-2
                    flex-wrap
                  "
                >
                  {status !==
                    'missing' && (
                    <span
                      className={clsx(
                        `
                          text-[10px]
                          sm:text-xs
                          px-2
                          py-1
                          rounded-full
                          font-mono
                          whitespace-nowrap
                        `,
                        status ===
                          'owned' &&
                          'bg-green-900/40 text-green-400',

                        status ===
                          'repeated' &&
                          'bg-yellow-900/40 text-yellow-400'
                      )}
                    >
                      ×{s.quantity}
                    </span>
                  )}

                  {/* ADD */}
                  <button
                    onClick={() =>
                      handleAdd(s.id)
                    }
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-green-900/30
                      border
                      border-green-900/40
                      text-green-400
                      hover:bg-green-500/20
                      flex
                      items-center
                      justify-center
                      transition-colors
                      flex-shrink-0
                    "
                  >
                    <Plus size={14} />
                  </button>

                  {/* REMOVE */}
                  {s.quantity > 0 && (
                    <button
                      onClick={() =>
                        handleRemove(s.id)
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
                    >
                      <Minus
                        size={14}
                      />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}