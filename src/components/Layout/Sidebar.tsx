import { NavLink } from 'react-router-dom'

import {
  LayoutDashboard,
  Package,
  Copy,
  Search,
  LogOut,
  Trophy,
} from 'lucide-react'

import { clsx } from 'clsx'

import { useAuthStore } from '@/stores/authStore'
import { useGlobalStats } from '@/hooks/useCollection'

const links = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Resumen',
  },
  {
    to: '/selecciones',
    icon: Trophy,
    label: 'Selecciones',
  },
  {
    to: '/sobre',
    icon: Package,
    label: 'Abrir sobre',
  },
  {
    to: '/repetidas',
    icon: Copy,
    label: 'Repetidas',
  },
  {
    to: '/buscar',
    icon: Search,
    label: 'Buscar',
  },
]

export function Sidebar() {
  const signOut = useAuthStore(s => s.signOut)

  const { data: stats } = useGlobalStats()

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className="
          hidden
          lg:flex
          w-64
          flex-shrink-0
          flex-col
          border-r
          border-green-900/40
          bg-pitch-950/80
          backdrop-blur-sm
          min-h-screen
        "
      >
        {/* LOGO */}
        <div className="px-6 py-6 border-b border-green-900/30">
          <div className="flex items-center gap-3">
            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-green-500/10
                border
                border-green-500/20
                flex
                items-center
                justify-center
                text-lg
              "
            >
              ⚽
            </div>

            <div>
              <h1
                className="
                  font-display
                  text-xl
                  text-white
                  leading-none
                "
              >
                MUNDIAL
              </h1>

              <p
                className="
                  text-[10px]
                  text-green-600
                  font-mono
                "
              >
                2026 · ÁLBUM
              </p>
            </div>
          </div>
        </div>

        {/* MINI PROGRESS */}
        {stats && (
          <div className="mx-4 my-3 glass rounded-xl p-3">
            <div
              className="
                flex
                justify-between
                text-xs
                mb-1.5
              "
            >
              <span className="text-green-700">
                Progreso total
              </span>

              <span
                className="
                  font-mono
                  text-green-400
                "
              >
                {Math.round(
                  (stats.owned / stats.total) * 100
                )}
                %
              </span>
            </div>

            <div
              className="
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
                  bg-gradient-to-r
                  from-green-500
                  to-green-300
                  transition-all
                  duration-700
                "
                style={{
                  width: `${
                    (stats.owned / stats.total) * 100
                  }%`,
                }}
              />
            </div>

            <p
              className="
                text-[10px]
                text-green-800
                mt-1.5
                font-mono
              "
            >
              {stats.owned} / {stats.total} estampas
            </p>
          </div>
        )}

        {/* NAV */}
        <nav
          className="
            flex-1
            px-3
            py-2
            space-y-1
          "
        >
          {links.map(
            ({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    `
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-sm
                      transition-all
                      duration-150
                      group
                    `,
                    isActive
                      ? 'bg-green-500/10 text-green-300 border border-green-500/20'
                      : 'text-green-800 hover:text-green-400 hover:bg-white/3'
                  )
                }
              >
                <Icon size={16} />

                <span className="font-body">
                  {label}
                </span>
              </NavLink>
            )
          )}
        </nav>

        {/* SIGN OUT */}
        <div className="px-3 pb-4">
          <button
            onClick={signOut}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-xl
              text-sm
              text-green-900
              hover:text-red-400
              hover:bg-red-500/5
              transition-all
              duration-150
            "
          >
            <LogOut size={16} />

            <span className="font-body">
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div
        className="
          lg:hidden
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-green-900/30
          bg-[#04150a]/95
          backdrop-blur-xl
          px-2
          py-2
        "
      >
        <nav
          className="
            flex
            items-center
            justify-around
            gap-1
          "
        >
          {links.map(
            ({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    `
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      rounded-xl
                      px-2
                      py-2
                      min-w-[60px]
                      transition-all
                      duration-150
                    `,
                    isActive
                      ? 'text-green-300 bg-green-500/10'
                      : 'text-green-800'
                  )
                }
              >
                <Icon size={18} />

                <span
                  className="
                    text-[10px]
                    font-body
                  "
                >
                  {label}
                </span>
              </NavLink>
            )
          )}

          {/* MOBILE LOGOUT */}
          <button
            onClick={signOut}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              px-2
              py-2
              min-w-[60px]
              text-red-500
              hover:bg-red-500/10
              transition-colors
            "
          >
            <LogOut size={18} />

            <span
              className="
                text-[10px]
                font-body
              "
            >
              Salir
            </span>
          </button>
        </nav>
      </div>
    </>
  )
}