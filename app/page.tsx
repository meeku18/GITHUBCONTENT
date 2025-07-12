import Link from 'next/link'
import { Github, Twitter, Linkedin, BookOpen, Zap, TrendingUp, Users, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="border-b border-secondary-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">DevJournal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
            Transform Your{' '}
            <span className="text-primary-600">GitHub Activity</span>
            <br />
            Into Meaningful Stories
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Automatically generate AI-powered summaries of your daily development work and share your progress with the world. 
            From commit messages to comprehensive weekly reports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin" className="btn-primary text-lg px-8 py-3">
              Start Journaling Today
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Share Your Developer Journey
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Powerful features designed to help you showcase your work and build your developer brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                AI-Powered Summaries
              </h3>
              <p className="text-secondary-600">
                Automatically generate natural language summaries of your commits, PRs, and issues using advanced AI.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <Twitter className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Social Media Integration
              </h3>
              <p className="text-secondary-600">
                Share your progress directly to Twitter/X, LinkedIn, or save to Notion with one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-secondary-600">
                Track your streaks, earn badges, and visualize your development journey over time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Github className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                GitHub Integration
              </h3>
              <p className="text-secondary-600">
                Seamlessly connect your GitHub account and automatically fetch your activity data.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Public Developer Journal
              </h3>
              <p className="text-secondary-600">
                Create a beautiful public page showcasing your development journey and achievements.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Privacy Control
              </h3>
              <p className="text-secondary-600">
                Choose what to share publicly and keep your private repositories secure and private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Developer Journal?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of developers who are already sharing their journey and building their brand.
          </p>
          <Link href="/auth/signin" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">DevJournal</span>
            </div>
            <div className="text-secondary-400">
              © 2024 DevJournal. Built for developers, by developers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 