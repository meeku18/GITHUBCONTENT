'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Github, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('github', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to home */}
        <Link 
          href="/" 
          className="inline-flex items-center text-secondary-600 hover:text-secondary-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Sign in card */}
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Github className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Welcome to DevJournal
            </h1>
            <p className="text-secondary-600">
              Connect your GitHub account to start journaling your development journey
            </p>
          </div>

          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
          >
            <Github className="w-5 h-5" />
            <span>
              {isLoading ? 'Connecting...' : 'Continue with GitHub'}
            </span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            What you'll get:
          </h3>
          <div className="space-y-2 text-sm text-secondary-600">
            <p>✨ AI-powered summaries of your GitHub activity</p>
            <p>📱 Share to Twitter/X, LinkedIn, or Notion</p>
            <p>📊 Track your progress and earn badges</p>
            <p>🌐 Create a public developer journal</p>
          </div>
        </div>
      </div>
    </div>
  )
} 