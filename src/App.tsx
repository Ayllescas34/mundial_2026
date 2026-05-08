import { useEffect } from 'react'

import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { supabase } from '@/lib/supabase'

import { useAuthStore } from '@/stores/authStore'

import { AuthPage } from '@/pages/AuthPage'

import { AppLayout } from '@/components/Layout/AppLayout'

import { Dashboard } from '@/pages/Dashboard'
import { TeamsPage } from '@/pages/TeamsPage'
import { TeamDetailPage } from '@/pages/TeamDetailPage'
import { OpenPackPage } from '@/pages/OpenPackPage'
import { RepeatedPage } from '@/pages/RepeatedPage'
import { SearchPage } from '@/pages/SearchPage'

function LoadingScreen() {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#020c04]
      "
    >
      <div
        className="
          text-green-700
          font-display
          text-2xl
          animate-pulse
          tracking-wider
        "
      >
        CARGANDO...
      </div>
    </div>
  )
}

function PrivateRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } =
    useAuthStore()

  if (loading) {
    return <LoadingScreen />
  }

  return user
    ? <>{children}</>
    : (
      <Navigate
        to="/auth"
        replace
      />
    )
}

function PublicRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } =
    useAuthStore()

  if (loading) {
    return <LoadingScreen />
  }

  return user
    ? (
      <Navigate
        to="/"
        replace
      />
    )
    : <>{children}</>
}

export default function App() {
  const {
    setSession,
    setLoading,
  } = useAuthStore()

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(
        ({
          data: { session },
        }) => {
          setSession(session)
          setLoading(false)
        }
      )

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session)
          setLoading(false)
        }
      )

    return () =>
      subscription.unsubscribe()
  }, [setSession, setLoading])

  return (
    <Routes>
      {/* PUBLIC */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* PRIVATE */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="selecciones"
          element={<TeamsPage />}
        />

        <Route
          path="selecciones/:id"
          element={
            <TeamDetailPage />
          }
        />

        <Route
          path="sobre"
          element={
            <OpenPackPage />
          }
        />

        <Route
          path="repetidas"
          element={
            <RepeatedPage />
          }
        />

        <Route
          path="buscar"
          element={<SearchPage />}
        />
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  )
}