'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import Stepper, { Step } from '@/components/Stepper'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { signIn } from 'next-auth/react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [step, setStep] = useState(1)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const prevStep = useRef(1)
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get('error')
    if (err === 'OAuthAccountNotLinked') {
      toast.error('Please use the same account/method you registered with.')
    }
  }, [])

  const notify = (msg: string, type: 'success' | 'error' = 'error') =>
    toast[type](msg, { position: 'top-right', autoClose: 3000 })

  const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const validPassword = (p: string) => p.length >= 6 && p.length <= 8

  const sendOtp = async () => {
    if (!validEmail(email)) return notify('Enter a valid email')
    const chk = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`)
    if (chk.ok && (await chk.json()).exists) return notify('Email already registered')
    setIsSendingOtp(true)
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setIsSendingOtp(false)
    if (!res.ok) {
      notify((await res.json()).error || 'Could not send OTP')
      setOtpSent(false)
      return
    }
    setOtpSent(true)
    notify('OTP sent to your email', 'success')
  }

  const verifyOtp = async () => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) {
      notify(data.error || 'OTP verification failed');
      return;
    }

    notify("OTP Verified!", "success");
    setOtpVerified(true);
  }

  const checkUsernameAvailability = async (username: string) => {
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("Failed to check username");
      const data = await res.json();
      setUsernameAvailable(!data.exists);
    } catch (err) {
      console.error("Username check error:", err);
      setUsernameAvailable(null);
    }
  }

  // Debounced username availability check
  useEffect(() => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    const delay = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500);

    return () => clearTimeout(delay);
  }, [username]);

  const handleNext = async (newStep: number) => {
    if (prevStep.current === 1 && newStep === 2) {
      if (!validEmail(email)) return notify('Please enter a valid email') || false
      if (!otpSent) return notify('Please send OTP to proceed') || false
    }

    if (prevStep.current === 2 && newStep === 3 && !otpVerified)
      return notify('Please verify OTP before continuing') || false

    if (prevStep.current === 3 && newStep === 4) {
      if (!username.trim()) return notify('Username cannot be empty') || false
      if (!usernameAvailable) return notify('Username is not available') || false
    }

    prevStep.current = newStep
    return true
  }

  const handleFinish = async () => {
    if (!validPassword(password)) return notify('Password must be 6–8 characters')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    })
    if (!res.ok) {
      notify((await res.json()).error || 'Registration failed')
      return
    }
    notify('Welcome aboard!', 'success')
    router.push('/dashboard')
  }

  const inputClass =
    'w-90 border border-neon-purple px-4 py-2 rounded-md focus:ring-2 focus:ring-neon-purple transition ml-4.5'

  return (
    <section className="flex items-center justify-center min-h-screen bg-background">
      <ToastContainer />
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-xl border ${
          resolvedTheme === 'dark'
            ? 'bg-black text-white border-neon-purple'
            : 'bg-white text-black border-gray-300'
        }`}
      >
        <h2 className="text-3xl font-techno text-neon-purple text-center mb-6">
          Register to CyberSentinel
        </h2>

        <Stepper
          initialStep={1}
          onStepChange={async (ns) => {
            const ok = await handleNext(ns)
            if (ok) setStep(ns)
          }}
          onFinalStepCompleted={handleFinish}
          nextButtonProps={{
            disabled:
              (step === 1 && (!validEmail(email) || !otpSent)) ||
              (step === 2 && !otpVerified) ||
              (step === 3 && (!username.trim() || usernameAvailable !== true)) ||
              (step === 4 && !validPassword(password)),
          }}
        >
          {/* Step 1: Email Input + OTP Send */}
          <Step>
            <div className="flex flex-col gap-3 items-center">
              <input
                className={inputClass}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setOtpSent(false)
                  setOtpVerified(false)
                }}
                type="email"
              />
              <button
                onClick={sendOtp}
                disabled={isSendingOtp || !validEmail(email)}
                className="px-4 py-2 bg-neon-purple text-white rounded hover:bg-opacity-90 transition disabled:opacity-50 text-sm"
              >
                {isSendingOtp ? 'Sending OTP...' : otpSent ? 'OTP Sent' : 'Send OTP'}
              </button>
            </div>
          </Step>

          {/* Step 2: OTP Verification */}
          <Step>
            <div className="flex flex-col gap-3 items-center">
              <input
                className={inputClass}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value)
                  setOtpVerified(false)
                }}
                maxLength={6}
              />
              <button
                onClick={verifyOtp}
                className="px-4 py-2 text-sm bg-neon-purple text-white rounded hover:bg-opacity-90 transition disabled:opacity-50"
                disabled={otp.length !== 6 || otpVerified}
              >
                {otpVerified ? 'Verified' : 'Verify OTP'}
              </button>
            </div>
          </Step>

          {/* Step 3: Username */}
          <Step>
            <div className="flex flex-col items-center gap-2">
              <input
                className={inputClass}
                placeholder="Choose a username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setUsernameAvailable(null)
                }}
              />
              {username && usernameAvailable === true && (
                <p className="text-green-500 text-sm">✅ Username is available</p>
              )}
              {username && usernameAvailable === false && (
                <p className="text-red-500 text-sm">❌ Username is taken</p>
              )}
            </div>
          </Step>

          {/* Step 4: Password */}
          <Step>
            <input
              className={inputClass}
              placeholder="Create password (6–8 chars)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Step>
        </Stepper>

        {/* Social Auth */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 hover:text-black"
          >
            <FcGoogle /> Sign up with Google
          </button>
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 hover:text-black"
          >
            <FaGithub /> Sign up with GitHub
          </button>
        </div>

        {/* Link to login */}
        <p className="text-center mt-4 text-sm text-gray-500">
          Already have an account?{' '}
          <span
            className="text-neon-purple underline cursor-pointer"
            onClick={() => router.push('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </section>
  )
}
