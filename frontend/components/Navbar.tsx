'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Know More', href: '/know-more' },
    ...(isLoggedIn
      ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'AIChat', href: '/chat' },
      ]
      : [{ name: 'Login', href: '/login' },{ name: 'Sign Up', href: '/sign-up' }]),

  ]

  useEffect(() => {
    setIsOpen(false) // close mobile menu on route change
  }, [pathname])

  const renderLinks = (className: string) =>
    links.map(({ name, href }) => (
      <Link
        key={name}
        href={href}
        className={`${className} ${
          pathname === href ? 'text-neon-purple underline' : ''
        }`}
      >
        {name}
      </Link>
    ))

  return (
    <nav className="w-full border-b border-gray-800 px-6 py-4 z-50 bg-background shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 🚀 Logo */}
        <Link
          href="/"
          className="font-techno text-neon-purple text-2xl hover:scale-105 transition-all"
        >
          CyberSentinel
        </Link>

        {/* 🖥 Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center text-sm font-semibold">
          {renderLinks('hover:text-neon-purple transition')}

          {isLoggedIn && (
            <button
              onClick={() => signOut()}
              className="text-red-500 hover:text-red-400 transition"
            >
              Logout
            </button>
          )}

          <ThemeToggle />
        </div>

        {/* 📱 Mobile Toggle */}
        <button
          className="md:hidden text-neon-purple"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex flex-col gap-4 mt-4 text-sm font-semibold px-4"
          >
            {renderLinks('hover:text-neon-purple transition')}

            {isLoggedIn && (
              <button
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-400 transition text-left"
              >
                Logout
              </button>
            )}

            <ThemeToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
