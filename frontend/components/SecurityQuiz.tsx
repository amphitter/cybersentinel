'use client'

import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowBigLeftDash, ArrowBigRight, ArrowBigRightDash, ArrowBigRightDashIcon, Info, Lightbulb } from 'lucide-react'
import axios from 'axios'

interface QuizItem {
  question: string
  options: string[]
  answer: number
  hint: string
}

export default function SecurityQuiz() {
  const [quizData, setQuizData] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [score, setScore] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [started, setStarted] = useState(false)
  const [highScore, setHighScore] = useState<number>(0)

  useEffect(() => {
    const savedHigh = localStorage.getItem('cyberQuizHighScore')
    if (savedHigh) setHighScore(Number(savedHigh))
  }, [])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/api/quiz')
        setQuizData(res.data)
        setAnswers(new Array(res.data.length).fill(null))
      } catch (err) {
        console.error('Failed to load quiz questions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleSubmit = () => {
    let newScore = 0
    quizData.forEach((q, i) => {
      if (answers[i] === q.answer) newScore++
    })
    setScore(newScore)
    setSubmitted(true)

    const prev = Number(localStorage.getItem('cyberQuizHighScore') || 0)
    if (newScore > prev) {
      localStorage.setItem('cyberQuizHighScore', newScore.toString())
      setHighScore(newScore)
    }
  }

  const handleSelect = (index: number) => {
    const updated = [...answers]
    updated[current] = index
    setAnswers(updated)
    setSelected(index)
  }

  const restartQuiz = () => {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setSubmitted(false)
    setStarted(false)
    setShowHint(false)
    setShowGuide(true)
    setQuizData([])
    setAnswers([])
    setLoading(true)

    // Refetch fresh questions
    axios.get('/api/quiz').then(res => {
      setQuizData(res.data)
      setAnswers(new Array(res.data.length).fill(null))
    }).catch(console.error).finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <Card className="p-6 h-[526px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading questions...</p>
      </Card>
    )
  }

  const question = quizData?.[current]

if (!question || !Array.isArray(question.options)) {
  return (
    <Card className="p-6 h-[526px] flex items-center justify-center">
      <p className="text-sm text-red-500 text-center">
        Failed to load quiz. Please try again later.
      </p>
    </Card>
  )
}

  return (
    <Card className="relative h-[526px] backdrop-blur-md bg-background/60 border shadow-xl overflow-hidden transition-colors">
      {started && !submitted && (
        <>
          <div className="absolute top-3 left-4 text-xs bg-neon-purple text-black dark:text-white px-3 py-1 rounded font-bold z-10 shadow-md">
            Question: {current + 1} / {quizData.length}
          </div>
          <button
            onClick={() => setShowHint((prev) => !prev)}
            className="absolute top-3 right-4 text-xs px-2 py-1 rounded bg-neon-purple text-black dark:text-white hover:bg-purple-500 font-semibold flex items-center gap-1 shadow"
          >
            <Lightbulb size={14} />
            Hint
          </button>
        </>
      )}

      <CardHeader className="pb-2 mt-8">
        <CardTitle className="text-neon-purple text-xl text-center tracking-wide">
          CyberSentinel AI Quiz
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-y-auto px-4 pb-6 scroll-smooth max-h-[425px] text-foreground">
        <AnimatePresence>
          {!started && !submitted && showGuide && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm border border-purple-500 rounded p-4 mb-4"
            >
              <h3 className="text-neon-purple font-semibold mb-2 flex items-center gap-2">
                <Info size={16} /> Rules to Play
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-xs">
                <li>Each question is AI-generated for freshness.</li>
                <li>Use hints if needed.</li>
                <li>+1 for every correct answer.</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {submitted ? (
          <div className="text-center mt-10 space-y-4">
            <h2 className="text-2xl font-bold text-neon-purple">Quiz Complete!</h2>
            <p className="text-lg">Your Score: <span className="font-bold">{score}/{quizData.length}</span></p>
            <p className="text-sm text-muted-foreground">High Score: {highScore}</p>
            <button
              onClick={restartQuiz}
              className="bg-neon-purple text-black dark:text-white px-4 py-2 rounded font-bold hover:bg-purple-500 transition"
            >
              Play Again
            </button>
          </div>
        ) : !started ? (
          <button
            onClick={() => {
              setStarted(true)
              setShowGuide(false)
            }}
            className="w-full bg-neon-purple text-black dark:text-white py-2 rounded font-bold hover:bg-purple-500 transition"
          >
            Start Quiz
          </button>
        ) : (
<>
  <p className="text-base font-semibold mb-3">{question.question}</p>

            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`block w-full px-3 py-2 rounded border text-left transition font-medium mb-2 ${
                  selected === idx
                    ? 'bg-purple-700/80 border-purple-500 text-white'
                    : 'bg-muted/20 hover:bg-muted border-border'
                }`}
              >
                {opt}
              </button>
            ))}

            {showHint && (
              <div className="bg-yellow-300 text-black text-xs px-3 py-2 rounded mt-2 border border-yellow-500 shadow-inner">
                💡 <strong>Hint:</strong> {question.hint}
              </div>
            )}

            <div className="flex justify-between items-center mt-4 gap-2">
              <button
                disabled={current === 0}
                onClick={() => {
                  setCurrent((prev) => prev - 1)
                  setSelected(answers[current - 1])
                  setShowHint(false)
                }}
                className="bg-muted px-4 py-2 rounded font-semibold text-sm"
              >
                Prev <ArrowBigLeftDash/>
              </button>

              {current === quizData.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={answers[current] === null}
                  className="bg-neon-purple text-black dark:text-white px-4 py-2 rounded font-bold hover:bg-purple-500 transition"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrent((prev) => prev + 1)
                    setSelected(answers[current + 1])
                    setShowHint(false)
                  }}
                  disabled={answers[current] === null}
                  className="bg-neon-purple text-black dark:text-white px-4 py-2 rounded font-bold hover:bg-purple-500 transition"
                >
                  Next <ArrowBigRightDashIcon />

                </button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
