'use client'

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useTheme } from 'next-themes'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

const res = await signIn("credentials", {
  redirect: false,
  email: username,  // username or email both go here
  password,
  callbackUrl: "/dashboard",
})


    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
    }

    setLoading(false)
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[85vh] px-4 transition-colors duration-300 bg-background">
      <div className={`border border-neon-purple rounded-lg p-8 w-full max-w-md shadow-xl shadow-purple-500/20 ${resolvedTheme === 'dark' ? 'bg-black' : 'bg-white text-black'}`}>
        <h2 className="text-3xl font-techno text-neon-purple mb-6 text-center">
          Login to CyberSentinel
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            className={`border border-neon-purple px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-purple transition ${
              resolvedTheme === 'dark'
                ? 'bg-black text-white placeholder:text-gray-500'
                : 'bg-white text-black placeholder:text-gray-400'
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className={`border border-neon-purple px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-purple transition ${
              resolvedTheme === 'dark'
                ? 'bg-black text-white placeholder:text-gray-500'
                : 'bg-white text-black placeholder:text-gray-400'
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-neon-purple border-b-fuchsia-500 hover:bg-purple-500 transition px-4 py-2 rounded-md font-semibold text-black dark:text-white"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* 🔐 Social Auth */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => handleSocialLogin('google')}
            className={`flex items-center justify-center gap-3 border px-4 py-2 rounded transition ${
              resolvedTheme === 'dark'
                ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 text-white'
                : 'bg-white border-gray-300 hover:bg-gray-100 text-black'
            }`}
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
          <button
            onClick={() => handleSocialLogin('github')}
            className={`flex items-center justify-center gap-3 border px-4 py-2 rounded transition ${
              resolvedTheme === 'dark'
                ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 text-white'
                : 'bg-white border-gray-300 hover:bg-gray-100 text-black'
            }`}
          >
            <FaGithub className="text-blue-500 text-xl" />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </section>
  )
}
