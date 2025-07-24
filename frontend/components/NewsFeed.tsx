'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useTheme } from 'next-themes'

interface NewsArticle {
  title: string
  url: string
  publishedAt: string
  source: { name: string }
}

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data } = await axios.get(
          `https://gnews.io/api/v4/search?q=cyber+attack&lang=en&token=6f0a17341940136499d1475fb461aab6`
        )
        setArticles(data.articles.slice(0, 5))
      } catch (err) {
        console.error('News fetch error', err)
      }
    }

    fetchNews()
  }, [])

  const baseClasses = `p-6 rounded-2xl border h-full transition-colors` // ⬅️ Removed shadow

  const darkModeStyles = `bg-black border-neon-purple`
  const lightModeStyles = `bg-gradient-to-br from-white to-gray-100 border-gray-300`

  const containerClass =
    resolvedTheme === 'dark'
      ? `${baseClasses} ${darkModeStyles}`
      : `${baseClasses} ${lightModeStyles}`

  const titleColor = resolvedTheme === 'dark' ? 'text-white' : 'text-black'
  const subTextColor =
    resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className={containerClass}>
      <h2 className="text-xl font-bold text-neon-purple mb-4">
        Latest Cyber Attacks
      </h2>
      <ul className="space-y-4 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neon-purple/60 scrollbar-track-transparent">
        {articles.map((article, i) => (
          <li key={i}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-base font-semibold hover:text-neon-purple transition ${titleColor}`}
            >
              {article.title}
            </a>
            <p className={`text-sm ${subTextColor}`}>
              {article.source.name} •{' '}
              {new Date(article.publishedAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
