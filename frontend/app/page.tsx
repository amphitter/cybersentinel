'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import DecryptedText from '@/components/DecryptedText'
import SpotlightCard from '@/components/SpotLightCard'
import { ArrowUpRight } from 'lucide-react'
import AIStatsChart from '@/components/AIStatsChart'
import NewsFeed from '@/components/NewsFeed'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  // Removed ringRef and ballRef

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power2.out',
        }
      )
    }
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }
    // Removed ring and ball GSAP animations
  }, [])

  return (
    <section className="flex flex-col items-center text-center px-4 py-8 transition-colors duration-300 dark:bg-dark-bg">
      {/* 🎯 Hero Centered Section */}
      <div ref={heroRef} className="flex flex-col justify-center items-center min-h-[80vh] w-full animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-techno text-gray-900 dark:text-white mb-4">
          Welcome to{' '}
          <DecryptedText
            text="CyberSentinel"
            speed={60}
            maxIterations={15}
            sequential
            revealDirection="center"
            animateOn="view"
            className="inline-block text-inherit text-neon-purple"
            encryptedClassName="inline-block text-gray-500 dark:text-gray-600"
          />
        </h1>

        <p className="text-lg max-w-xl mt-2 text-gray-700 dark:text-gray-400">
          Your AI-Powered Cybersecurity Companion to fight phishing, malware, and data leaks.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 flex-wrap justify-center">
          {/* Try Now */}
          <Link
            href="/login"
            onMouseEnter={() => setHoveredButton('try')}
            onMouseLeave={() => setHoveredButton(null)}
            className="px-6 py-3 rounded-md font-bold border border-neon-purple text-neon-purple hover:bg-neon-purple transition-all shadow-md hover:shadow-[0_0_20px_rgba(185,128,255,0.8)]"
          >
            {hoveredButton === 'try' ? (
              <DecryptedText
                text="Try Now"
                speed={70}
                maxIterations={10}
                className="text-black dark:text-white"
                encryptedClassName="text-gray-400"
              />
            ) : (
              'Try Now'
            )}
          </Link>

          {/* Know More */}
          <Link
            href="/know-more"
            onMouseEnter={() => setHoveredButton('know')}
            onMouseLeave={() => setHoveredButton(null)}
            className="px-6 py-3 rounded-md font-bold border border-neon-purple text-neon-purple hover:bg-neon-purple transition-all shadow-md hover:shadow-[0_0_20px_rgba(185,128,255,0.8)]"
          >
            {hoveredButton === 'know' ? (
              <DecryptedText
                text="Know More"
                speed={70}
                maxIterations={10}
                className="text-black dark:text-white"
                encryptedClassName="text-gray-400"
              />
            ) : (
              'Know More'
            )}
          </Link>

          {/* Download Extension */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredButton('download')}
            onMouseLeave={() => setHoveredButton(null)}
            className="px-6 py-3 rounded-md font-bold border border-neon-purple text-neon-purple hover:bg-neon-purple transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-[0_0_20px_rgba(185,128,255,0.8)]"
          >
            {hoveredButton === 'download' ? (
              <DecryptedText
                text="Download Extension"
                speed={50}
                maxIterations={10}
                className="text-black dark:text-white"
                encryptedClassName="text-gray-400"
              />
            ) : (
              <>
                Download Extension <ArrowUpRight size={18} className="mt-[1px]" />
              </>
            )}
          </a>
        </div>
      </div>

      {/* 💫 Divider or Border */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent my-12" />

      {/* 🧠 Features (Spotlight Cards) */}
      <div ref={cardsRef} className="mt-12 w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-4 sm:px-8 md:px-16 pb-4 min-w-[600px]">
          <SpotlightCard className="min-w-[260px]">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Real-Time Threat Detection
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Instantly detect phishing attempts and malware in user traffic.
            </p>
          </SpotlightCard>

          <SpotlightCard className="min-w-[260px]">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              AI-Powered Insights
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Analyze behavior anomalies using LLMs and ML models.
            </p>
          </SpotlightCard>

          <SpotlightCard className="min-w-[260px]">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Privacy Guardian
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Alerts on sensitive data leaks before they happen.
            </p>
          </SpotlightCard>

          <SpotlightCard className="min-w-[260px]">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Easy Integration
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Lightweight browser extension and secure backend API.
            </p>
          </SpotlightCard>
        </div>
      </div>

      {/* 📊 AI Chart + 📰 News */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full px-4 max-w-7xl mx-auto">
        <AIStatsChart />
        <NewsFeed />
      </div>
    </section>
  )
}
