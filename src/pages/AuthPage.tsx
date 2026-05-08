import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function AuthPage() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'register'>('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    try {
      if (mode === 'login') {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })

        if (error) {
          toast.error('Correo o contraseña incorrectos')
          return
        }

        if (data?.session) {
          toast.success('¡Bienvenido de nuevo!')

          navigate('/', { replace: true })
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        })

        if (error) {
          toast.error(error.message)
          return
        }

        toast.success(
          '¡Cuenta creada! Ya puedes iniciar sesión.'
        )

        setMode('login')
        setPassword('')
        setName('')
      }
    } catch (err: any) {
      toast.error(err.message || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        grass-bg
        px-4
        sm:px-6
        py-8
        overflow-hidden
        relative
      "
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(20,83,45,0.4) 0%, #020c04 60%)',
      }}
    >
      {/* BG BLOBS */}
      <div
        className="
          fixed
          top-[-80px]
          left-[-80px]
          sm:top-1/4
          sm:left-1/4
          w-64
          h-64
          sm:w-96
          sm:h-96
          bg-green-900/20
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          fixed
          bottom-[-60px]
          right-[-60px]
          sm:bottom-1/4
          sm:right-1/4
          w-56
          h-56
          sm:w-80
          sm:h-80
          bg-yellow-900/10
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      {/* CARD */}
      <div
        className="
          w-full
          max-w-md
          anim-slide-up
          relative
          z-10
        "
      >
        {/* HEADER */}
        <div className="text-center mb-6 sm:mb-8">
          <div
            className="
              text-5xl
              sm:text-6xl
              mb-4
              anim-float
              inline-block
            "
          >
            ⚽
          </div>

          <h1
            className="
              font-display
              text-3xl
              sm:text-5xl
              text-white
              tracking-wider
              leading-tight
            "
          >
            MUNDIAL 2026
          </h1>

          <p
            className="
              text-green-600
              text-xs
              sm:text-sm
              mt-2
              font-body
            "
          >
            Álbum de estampas digital
          </p>
        </div>

        {/* GLASS CARD */}
        <div
          className="
            glass
            rounded-2xl
            sm:rounded-3xl
            p-5
            sm:p-8
            backdrop-blur-xl
          "
        >
          {/* TABS */}
          <div
            className="
              flex
              rounded-xl
              bg-white/3
              p-1
              mb-6
              gap-1
            "
          >
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`
                  flex-1
                  py-2.5
                  px-2
                  rounded-lg
                  text-xs
                  sm:text-sm
                  font-body
                  transition-all
                  duration-200
                  ${
                    mode === m
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'text-green-800 hover:text-green-600'
                  }
                `}
              >
                {m === 'login'
                  ? 'Iniciar sesión'
                  : 'Crear cuenta'}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {mode === 'register' && (
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
                  Nombre
                </label>

                <input
                  value={name}
                  onChange={e =>
                    setName(e.target.value)
                  }
                  required
                  placeholder="Tu nombre"
                  className="
                    w-full
                    bg-white/5
                    border
                    border-green-900/60
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-white
                    placeholder-green-900
                    focus:outline-none
                    focus:border-green-500/50
                    transition-colors
                    font-body
                  "
                />
              </div>
            )}

            {/* EMAIL */}
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
                Correo electrónico
              </label>

              <input
                type="email"
                value={email}
                onChange={e =>
                  setEmail(e.target.value)
                }
                required
                placeholder="tu@correo.com"
                className="
                  w-full
                  bg-white/5
                  border
                  border-green-900/60
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-white
                  placeholder-green-900
                  focus:outline-none
                  focus:border-green-500/50
                  transition-colors
                  font-body
                "
              />
            </div>

            {/* PASSWORD */}
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
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={e =>
                  setPassword(e.target.value)
                }
                required
                placeholder="••••••••"
                minLength={6}
                className="
                  w-full
                  bg-white/5
                  border
                  border-green-900/60
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-white
                  placeholder-green-900
                  focus:outline-none
                  focus:border-green-500/50
                  transition-colors
                  font-body
                "
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3
                rounded-xl
                bg-green-500/20
                border
                border-green-500/40
                text-green-300
                hover:bg-green-500/30
                hover:border-green-400/60
                transition-all
                duration-200
                text-sm
                font-body
                font-medium
                disabled:opacity-40
                disabled:cursor-not-allowed
                mt-2
              "
            >
              {loading
                ? 'Cargando...'
                : mode === 'login'
                ? 'Entrar al álbum →'
                : 'Crear mi álbum →'}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p
          className="
            text-center
            text-[11px]
            sm:text-xs
            text-green-900
            mt-4
            font-body
            px-4
          "
        >
          Tus datos se guardan de forma segura y privada
        </p>
      </div>
    </div>
  )
}