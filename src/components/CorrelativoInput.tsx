import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Plus,
  Search,
} from 'lucide-react'

import { getStickerByNumber } from '@/api/stickers'

import { useAddStickers } from '@/hooks/useCollection'

import toast from 'react-hot-toast'

export function CorrelativoInput() {
  const [value, setValue] = useState('')

  const [stickers, setStickers] = useState<any[]>(
    []
  )

  const addMutation = useAddStickers()

  const stickersInput = useMemo(() => {
    return value
      .split(/[\s,]+/)
      .map(text =>
        text
          .trim()
          .toUpperCase()
      )
      .filter(Boolean)
  }, [value])

  async function buscarStickers() {
    try {
      const results = []

      for (const number of stickersInput) {
        const sticker =
          await getStickerByNumber(
            number
          )

        if (sticker) {
          results.push(sticker)
        }
      }

      setStickers(results)
    } catch {
      setStickers([])
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (stickersInput.length > 0) {
        buscarStickers()
      } else {
        setStickers([])
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [value])

  async function handleAdd() {
    if (!stickers.length) return

    try {
      await addMutation.mutateAsync(
        stickers.map(s => s.id)
      )

      toast.success(
        `${stickers.length} estampas agregadas`
      )

      setValue('')

      setStickers([])
    } catch {
      toast.error(
        'No se pudieron agregar'
      )
    }
  }

  return (
    <div className="space-y-5">
      {/* INPUT */}

      <div className="relative">
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
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Ej: POR15 ARG11 CC4"
          value={value}
          onChange={e =>
            setValue(e.target.value)
          }
          className="
            w-full
            rounded-2xl
            border
            border-green-900/40
            bg-white/5
            pl-12
            pr-4
            py-4
            text-sm
            text-white
            placeholder-green-900
            focus:outline-none
            focus:border-green-500/40
            font-body
          "
        />
      </div>

      <p
        className="
          text-xs
          text-green-800
          mt-2
          px-1
          font-body
        "
      >
        Puedes pegar varias estampas a la vez
      </p>

      {/* RESULTS */}

      {stickers.length > 0 && (
        <div className="space-y-3">
          {stickers.map(sticker => (
            <div
              key={sticker.id}
              className="
                glass
                rounded-2xl
                p-5
                border
                border-green-500/20
                anim-fade
              "
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">
                  {
                    sticker.team
                      ?.flag_emoji
                  }
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="
                        text-xs
                        px-2
                        py-0.5
                        rounded-full
                        bg-green-900/30
                        text-green-300
                        font-mono
                      "
                    >
                      {sticker.number}
                    </span>
                  </div>

                  <h3
                    className="
                      text-white
                      text-lg
                      font-semibold
                    "
                  >
                    {sticker.name}
                  </h3>

                  <p
                    className="
                      text-green-700
                      text-sm
                      mt-1
                    "
                  >
                    {sticker.team?.name}
                    {' · '}
                    {
                      sticker.position ??
                      (
                        sticker.type ===
                          'badge'
                          ? 'Escudo'
                          : sticker.type ===
                              'squad'
                            ? 'Foto del equipo'
                            : sticker.type ===
                                'special'
                              ? 'Especial FIFA'
                              : sticker.type ===
                                  'coca_cola'
                                ? 'Coca Cola Collection'
                                : 'Sticker oficial'
                      )
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAdd}
            disabled={
              addMutation.isPending
            }
            className="
              w-full
              h-12
              rounded-2xl
              bg-green-500/10
              border
              border-green-500/20
              text-green-300
              hover:bg-green-500/20
              transition-all
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Plus size={18} />

            Agregar {
              stickers.length
            } estampas
          </button>
        </div>
      )}

      {/* EMPTY */}

      {!stickers.length &&
        value && (
          <div
            className="
              glass
              rounded-2xl
              p-6
              text-center
            "
          >
            <p className="text-red-400 text-sm">
              No se encontraron estampas
            </p>
          </div>
        )}
    </div>
  )
}