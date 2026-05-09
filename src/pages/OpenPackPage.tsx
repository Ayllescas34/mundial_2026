import { useState } from 'react'

import {
  Sparkles,
  RotateCcw,
} from 'lucide-react'

import { useAuthStore } from '@/stores/authStore'

import { CorrelativoInput } from '@/components/CorrelativoInput'

export function OpenPackPage() {
  useAuthStore(s => s.user)

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

      {/* INPUT POR CORRELATIVO */}
      <div className="mb-6">
        <CorrelativoInput />
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
    </div>
  )
}