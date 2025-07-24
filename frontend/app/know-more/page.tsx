'use client'

import { useTheme } from 'next-themes'
import { GlitchText } from '@/components/GlitchText'
import { FeatureCard } from '@/components/FeatureCard'
import { ChartSection } from '@/components/ChartSection'
import { motion } from 'framer-motion'
import { HandwrittenFlowChart } from '@/components/HandwrittenFlowChart'

const features = [
  {
    title: 'Real-time Threat Detection',
    description: 'Scans suspicious files and links instantly using LLMs and heuristic engines.',
  },
  {
    title: 'Interactive Awareness Mode',
    description: 'Trains users with real-world scam examples and gamified quizzes.',
  },
  {
    title: 'Threat Analytics Dashboard',
    description: 'Visualizes scam trends, user risks, dark web alerts, and red-flag activity.',
  },
  {
    title: 'Crowdsourced Threat Learning',
    description: 'Learns from user-reported threats and adapts the AI models dynamically.',
  },
  {
    title: 'Mini Virtual Sandbox',
    description: 'Simulates file/link behavior in a secure, isolated virtual environment.',
  },
  {
    title: 'Data Leak Checker',
    description: 'Monitors breach databases for your emails and credentials in real time.',
  },
  {
    title: 'Gamified Learning',
    description: 'Fun cybersecurity missions and daily rewards to build secure habits.',
  },
  {
    title: 'Browser Extension & Mobile App',
    description: 'Cross-platform protection that follows you wherever you go.',
  },
]

export default function KnowMorePage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <section className={`px-6 pb-20 max-w-7xl mx-auto transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
      {/* 🔠 Title and Subtitle */}
      <div className="mt-10 text-center">
        <GlitchText text="Know CyberSentinel" />
        <p className={`mt-4 max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Dive deep into CyberSentinel’s mission to turn users from targets into defenders.
        </p>
      </div>

      {/* 💡 Features */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
      >
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </motion.div>

      {/* 🧩 Flowchart */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-techno text-neon-purple mb-6">How CyberSentinel Works</h2>
        <HandwrittenFlowChart />
        <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>User → Scan → Detect → Educate → Improve</p>
      </div>

      {/* 📊 Dashboard/Chart */}
      <div className="mt-24">
        <ChartSection />
      </div>

      {/* 🔮 Future Scope */}
      <div className="mt-24 text-center">
        <h2 className="text-2xl font-techno text-neon-purple mb-4">Future Vision</h2>
        <motion.ul
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`space-y-2 max-w-xl mx-auto text-left ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          <li>⚡ Advanced AI for deeper threat pattern detection</li>
          <li>📱 Seamless Web + Mobile integration for real-time sync</li>
          <li>🌐 Global crowdsourced threat intelligence network</li>
          <li>🤝 Government, corporate & EdTech partnerships</li>
          <li>💡 Ethical monetization with transparency & user trust</li>
        </motion.ul>
      </div>
    </section>
  )
}
