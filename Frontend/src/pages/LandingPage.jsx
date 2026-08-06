import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Building2 } from 'lucide-react'
import { createRun } from '../lib/api'

export default function LandingPage() {
  const [idea, setIdea] = useState('')
  const [targetMarket, setTargetMarket] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!idea.trim()) return

    setIsSubmitting(true)

    try {
      const runId = await createRun({
        idea_text: idea.trim(),
        target_market: targetMarket,
        business_type: businessType
      })

      navigate(`/company/${runId}`)
    } catch (error) {
      console.error('Error creating run:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow delay-75"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary-100 rounded-full">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Day One
          </h1>

          <p className="text-xl text-gray-600 mb-2">
            Every AI tool says yes to your bad startup idea.
          </p>
          <p className="text-xl text-gray-900 font-medium">
            Ours argues with you.
          </p>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
          <div className="card">
            <div className="text-left mb-4">
              <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                What's your startup idea?
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="A platform that helps university students find internships..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Optional disambiguation */}
            {idea.length > 20 && (
              <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target market (optional)
                  </label>
                  <select
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select market...</option>
                    <option value="students">Students</option>
                    <option value="professionals">Professionals</option>
                    <option value="small-business">Small Business</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="consumers">General Consumers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business model (optional)
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select type...</option>
                    <option value="b2b">B2B</option>
                    <option value="b2c">B2C</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="saas">SaaS</option>
                    <option value="ecommerce">E-commerce</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!idea.trim() || isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Opening the office...
              </>
            ) : (
              <>
                Start building my company
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer tagline */}
        <p className="mt-8 text-gray-500 italic animate-fade-in delay-300">
          "Every company starts with an idea. The best ones survive an argument first."
        </p>
      </div>
    </div>
  )
}