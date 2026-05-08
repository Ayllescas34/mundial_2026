import { useState } from 'react'

import { Link } from 'react-router-dom'

import { useTeamsProgress } from '@/hooks/useCollection'

import { ProgressRing } from '@/components/ui/ProgressRing'

import { Search } from 'lucide-react'

export function TeamsPage() {
  const {
    data: teams,
    isLoading,
  } = useTeamsProgress()

  const [search, setSearch] =
    useState('')

  const filtered = (
    teams ?? []
  ).filter(
    t =>
      t.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      t.group_name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  )

  const groups = filtered.reduce<
    Record<string, typeof filtered>
  >((acc, t) => {
    acc[t.group_name] = [
      ...(acc[t.group_name] ?? []),
      t,
    ]

    return acc
  }, {})

  return (
    <div
      className="
        w-full
        max-w-7xl
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
          SELECCIONES
        </h2>

        <p
          className="
            text-green-700
            text-xs
            sm:text-sm
            font-body
          "
        >
          48 equipos · 960 estampas
        </p>
      </div>

      {/* SEARCH */}
      <div
        className="
          relative
          mb-8
          w-full
          sm:max-w-sm
        "
      >
        <Search
          size={16}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-green-700
          "
        />

        <input
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
          placeholder="Buscar selección o grupo..."
          className="
            w-full
            bg-white/5
            border
            border-green-900/40
            rounded-xl
            pl-10
            pr-4
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

      {/* LOADING */}
      {isLoading ? (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-4
          "
        >
          {Array.from({
            length: 12,
          }).map((_, i) => (
            <div
              key={i}
              className="
                glass
                rounded-2xl
                p-5
                animate-pulse
                h-36
              "
            />
          ))}
        </div>
      ) : (
        /* CONTENT */
        <div className="space-y-8">
          {Object.entries(groups).map(
            ([group, groupTeams]) => (
              <div
                key={group}
                className="anim-slide-up"
              >
                {/* GROUP */}
                <h3
                  className="
                    font-display
                    text-xl
                    sm:text-2xl
                    text-green-600
                    mb-4
                    break-words
                  "
                >
                  {group}
                </h3>

                {/* GRID */}
                <div
                  className="
                    grid
                    grid-cols-1
                    xs:grid-cols-2
                    sm:grid-cols-2
                    md:grid-cols-3
                    xl:grid-cols-4
                    gap-4
                  "
                >
                  {groupTeams.map(
                    team => (
                      <Link
                        key={team.id}
                        to={`/selecciones/${team.id}`}
                        className="
                          glass
                          rounded-2xl
                          p-4
                          sm:p-5
                          hover:border-green-500/30
                          transition-all
                          duration-200
                          hover:bg-green-900/20
                          group
                        "
                      >
                        {/* TOP */}
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                            mb-3
                          "
                        >
                          <span
                            className="
                              text-3xl
                              sm:text-4xl
                              leading-none
                            "
                          >
                            {
                              team.flag_emoji
                            }
                          </span>

                          <div className="scale-90 sm:scale-100">
                            <ProgressRing
                              pct={
                                team.pct
                              }
                              size={40}
                              stroke={3}
                              color={
                                team.pct ===
                                100
                                  ? '#fbbf24'
                                  : team.pct >
                                    50
                                  ? '#4ade80'
                                  : '#22c55e'
                              }
                            />
                          </div>
                        </div>

                        {/* NAME */}
                        <h4
                          className="
                            font-body
                            font-medium
                            text-sm
                            text-white
                            group-hover:text-green-200
                            mb-1
                            break-words
                            leading-snug
                          "
                        >
                          {team.name}
                        </h4>

                        {/* COUNT */}
                        <p
                          className="
                            text-xs
                            text-green-700
                            font-mono
                          "
                        >
                          {team.owned}/
                          {
                            team.total_stickers
                          }
                        </p>

                        {/* BAR */}
                        <div
                          className="
                            mt-3
                            h-1
                            rounded-full
                            bg-white/5
                            overflow-hidden
                          "
                        >
                          <div
                            className="
                              h-full
                              rounded-full
                              transition-all
                              duration-700
                            "
                            style={{
                              width: `${team.pct}%`,
                              background:
                                team.pct ===
                                100
                                  ? '#fbbf24'
                                  : '#4ade80',
                            }}
                          />
                        </div>
                      </Link>
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