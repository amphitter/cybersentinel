'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

export function ChartSection() {
  const data = {
    labels: ['Phishing', 'Malware', 'Leaks', 'Spam'],
    datasets: [
      {
        label: 'Threat Volume (Mock)',
        data: [45, 38, 28, 10],
        backgroundColor: '#b980ff',
      },
    ],
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-techno mb-4 text-neon-purple">Threat Analytics</h2>
      <Bar data={data} />
      <p className="text-sm text-gray-500 mt-2">Based on global mock reports</p>
    </div>
  )
}
