import {
  Trophy,
  Package,
  Copy,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'

import { StatCard } from '@/components/ui/StatCard'
import { ProgressRing } from '@/components/ui/ProgressRing'
import {
  useGlobalStats,
  useTeamsProgress,
} from '@/hooks/useCollection'

import { useAuthStore } from '@/stores/authStore'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const user = useAuthStore(s => s.user)

  const {
    data: stats,
    isLoading: statsLoading,
  } = useGlobalStats()

  const { data: teams } = useTeamsProgress()

  const pct = stats
    ? Math.round((stats.owned / stats.total) * 100)
    : 0

  const topTeams = (teams ?? [])
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5)

  const worstTeams = (teams ?? [])
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5)

  const name =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Coleccionista'

  return (
    <div
      className="
        p-4
        sm:p-6
        lg:p-8
        max-w-6xl
        mx-auto
      "
    >
      {/* HEADER */}
      <div className="mb-6 sm:mb-8 anim-fade">
        <p
          className="
            text-green-700
            text-xs
            sm:text-sm
            font-body
            mb-1
          "
        >
          Bienvenido,
        </p>

        <h2
          className="
            font-display
            text-3xl
            sm:text-4xl
            lg:text-5xl
            text-white
            tracking-wide
            break-words
            leading-tight
          "
        >
          {name.toUpperCase()}
        </h2>
      </div>

      {/* HERO */}
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
          sm:gap-8
          anim-slide-up
          overflow-hidden
          relative
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-yellow-900/10
            to-transparent
            pointer-events-none
          "
        />

        {/* PROGRESS */}
        <div className="relative flex-shrink-0">
          <ProgressRing
            pct={pct}
            size={window.innerWidth < 640 ? 100 : 120}
            stroke={8}
            color="#fbbf24"
          />

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              flex-col
            "
          >
            <span
              className="
                font-display
                text-2xl
                sm:text-3xl
                text-yellow-400
                leading-none
              "
            >
              {pct}
            </span>

            <span
              className="
                text-yellow-600
                text-[10px]
                font-mono
              "
            >
              %
            </span>
          </div>
        </div>

        {/* INFO */}
        <div
          className="
            flex-1
            w-full
            text-center
            lg:text-left
          "
        >
          <h3
            className="
              font-display
              text-2xl
              sm:text-3xl
              text-white
              mb-1
            "
          >
            TU ÁLBUM
          </h3>

          {statsLoading ? (
            <div className="h-4 w-48 bg-white/10 rounded animate-pulse mx-auto lg:mx-0" />
          ) : (
            <p
              className="
                text-yellow-600
                font-body
                text-sm
              "
            >
              {stats?.owned} de {stats?.total}{' '}
              estampas pegadas
            </p>
          )}

          {/* BAR */}
          <div
            className="
              mt-4
              h-2
              rounded-full
              bg-white/5
              overflow-hidden
              w-full
              max-w-sm
              mx-auto
              lg:mx-0
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-yellow-600
                to-yellow-300
                transition-all
                duration-700
              "
              style={{ width: `${pct}%` }}
            />
          </div>

          <p
            className="
              text-yellow-800
              text-xs
              mt-2
              font-mono
            "
          >
            {stats?.missing} faltantes ·{' '}
            {stats?.repeated} repetidas
          </p>
        </div>

        {/* BUTTON */}
        <Link
          to="/sobre"
          className="
            w-full
            sm:w-auto
            text-center
            flex-shrink-0
            px-6
            py-3
            rounded-2xl
            bg-yellow-500/20
            border
            border-yellow-500/40
            text-yellow-300
            hover:bg-yellow-500/30
            text-sm
            font-body
            transition-all
            hover:scale-105
          "
        >
          Abrir sobre ➜
        </Link>
      </div>

      {/* STATS */}
      {stats && (
        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-3
            sm:gap-4
            mb-8
          "
        >
          <StatCard
            label="Total estampas"
            value={stats.total}
            icon={Trophy}
            color="green"
            delay={0}
          />

          <StatCard
            label="Tengo"
            value={stats.owned}
            icon={Package}
            color="blue"
            delay={80}
          />

          <StatCard
            label="Repetidas"
            value={stats.repeated}
            icon={Copy}
            color="gold"
            delay={160}
          />

          <StatCard
            label="Faltantes"
            value={stats.missing}
            icon={AlertCircle}
            color="red"
            delay={240}
          />
        </div>
      )}

      {/* TEAMS */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >
        {/* TOP */}
        <div
          className="
            glass
            rounded-2xl
            p-4
            sm:p-6
            anim-slide-up
          "
          style={{ animationDelay: '300ms' }}
        >
          <h3
            className="
              font-display
              text-lg
              sm:text-xl
              text-white
              mb-4
              flex
              items-center
              gap-2
            "
          >
            <TrendingUp
              size={16}
              className="text-green-400"
            />

            MÁS COMPLETAS
          </h3>

          <div className="space-y-3">
            {topTeams.map((team, i) => (
              <Link
                key={team.id}
                to={`/selecciones/${team.id}`}
                className="
                  flex
                  items-center
                  gap-3
                  group
                  hover:bg-white/3
                  rounded-xl
                  p-2
                  transition-colors
                "
              >
                <span
                  className="
                    text-green-800
                    font-mono
                    text-xs
                    w-4
                  "
                >
                  {i + 1}
                </span>

                <span className="text-xl">
                  {team.flag_emoji}
                </span>

                <span
                  className="
                    text-xs
                    sm:text-sm
                    text-green-300
                    font-body
                    flex-1
                    truncate
                    group-hover:text-green-200
                  "
                >
                  {team.name}
                </span>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    min-w-[90px]
                  "
                >
                  <div
                    className="
                      hidden
                      sm:block
                      w-20
                      h-1.5
                      rounded-full
                      bg-white/5
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        h-full
                        rounded-full
                        bg-green-500
                      "
                      style={{
                        width: `${team.pct}%`,
                      }}
                    />
                  </div>

                  <span
                    className="
                      text-xs
                      font-mono
                      text-green-600
                      w-8
                      text-right
                    "
                  >
                    {team.pct}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* WORST */}
        <div
          className="
            glass
            rounded-2xl
            p-4
            sm:p-6
            anim-slide-up
          "
          style={{ animationDelay: '380ms' }}
        >
          <h3
            className="
              font-display
              text-lg
              sm:text-xl
              text-white
              mb-4
              flex
              items-center
              gap-2
            "
          >
            <AlertCircle
              size={16}
              className="text-red-400"
            />

            MÁS INCOMPLETAS
          </h3>

          <div className="space-y-3">
            {worstTeams.map((team, i) => (
              <Link
                key={team.id}
                to={`/selecciones/${team.id}`}
                className="
                  flex
                  items-center
                  gap-3
                  group
                  hover:bg-white/3
                  rounded-xl
                  p-2
                  transition-colors
                "
              >
                <span
                  className="
                    text-green-800
                    font-mono
                    text-xs
                    w-4
                  "
                >
                  {i + 1}
                </span>

                <span className="text-xl">
                  {team.flag_emoji}
                </span>

                <span
                  className="
                    text-xs
                    sm:text-sm
                    text-green-300
                    font-body
                    flex-1
                    truncate
                    group-hover:text-green-200
                  "
                >
                  {team.name}
                </span>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    min-w-[90px]
                  "
                >
                  <div
                    className="
                      hidden
                      sm:block
                      w-20
                      h-1.5
                      rounded-full
                      bg-white/5
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        h-full
                        rounded-full
                        bg-red-500
                      "
                      style={{
                        width: `${team.pct}%`,
                      }}
                    />
                  </div>

                  <span
                    className="
                      text-xs
                      font-mono
                      text-red-700
                      w-8
                      text-right
                    "
                  >
                    {team.pct}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}