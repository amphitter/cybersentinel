'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function getStatus(scan: any) {
  try {
    const result = typeof scan.result === 'string' ? JSON.parse(scan.result) : scan.result
    const engines = Object.values(result || {})
    const flagged = engines.filter((e: any) => e && e.result && !['clean', 'harmless', 'undetected', 'unrated', 'safe'].includes((e.result || '').toLowerCase())).length
    if (flagged > 0) return { label: 'Suspicious', color: 'text-yellow-400' }
    return { label: 'Safe', color: 'text-green-500' }
  } catch {
    return { label: 'Unknown', color: 'text-gray-400' }
  }
}

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return date.toLocaleString()
}

export default function LinkHistory() {
  const [links, setLinks] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/phishing/history')
      .then(res => res.json())
      .then(data => setLinks(data || []))
      .catch(() => setLinks([]))
  }, [])

  return (
    <Card className="h-[300px] overflow-hidden border bg-background text-foreground shadow-md">
      <CardHeader>
        <CardTitle className="text-neon-purple text-lg">Recent Link Scans</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[220px] pr-2 text-sm">
        {links.length === 0 ? (
          <p className="text-muted-foreground text-sm">No scans yet.</p>
        ) : (
          <div className="w-full">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-semibold text-muted-foreground pb-1">URL</th>
                  <th className="font-semibold text-muted-foreground pb-1">Status</th>
                  <th className="font-semibold text-muted-foreground pb-1">Time</th>
                </tr>
              </thead>
              <tbody>
                {links.map((scan, idx) => {
                  const status = getStatus(scan)
                  return (
                    <tr key={scan._id || idx} className="border-b border-muted last:border-b-0">
                      <td className="truncate max-w-[200px] align-middle">
                        <a
                          href={scan.input}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 dark:text-blue-400 underline hover:text-blue-300 transition-colors"
                          title={scan.input}
                        >
                          {scan.input}
                        </a>
                      </td>
                      <td className={`font-medium align-middle ${status.color}`}>{status.label}</td>
                      <td className="text-xs text-muted-foreground whitespace-nowrap align-middle">{timeAgo(scan.scannedAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
