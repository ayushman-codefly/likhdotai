"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useSession from "@/lib/supabase/use-session"
import { 
  Sparkles, 
  Target, 
  Users, 
  Globe, 
  FileText, 
  Hash,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Wand2,
  Loader2,
  SkipForward
} from "lucide-react"

const PLATFORMS = [
  { id: 'blog', name: 'Blog Post', icon: '📝', length: 'max 2000+ words' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', length: 'Short (300 words)' },
  { id: 'instagram', name: 'Instagram', icon: '📸', length: 'Very short (100 words)' },
  { id: 'twitter', name: 'X (Twitter)', icon: '🐦', length: 'Very short (280 chars)' },
  { id: 'newsletter', name: 'Newsletter', icon: '📧', length: 'Medium to Long (600-1200+ words)' },
  { id: 'youtube', name: 'YouTube Script', icon: '🎥', length: 'Long (2000+ words)' },
  { id: 'medium', name: 'Medium', icon: '✍️', length: 'Long (2000+ words)' },
  { id: 'custom', name: 'Custom', icon: '⚙️', length: 'You choose' }
]

const GOALS = [
  { id: 'educate', name: 'Educate', icon: '🎓', desc: 'Teach something new' },
  { id: 'entertain', name: 'Entertain', icon: '🎭', desc: 'Make it fun and engaging' },
  { id: 'persuade', name: 'Persuade', icon: '💪', desc: 'Change minds or behavior' },
  { id: 'traffic', name: 'Drive Traffic', icon: '🚀', desc: 'Get more visitors' },
  { id: 'seo', name: 'Rank on Google', icon: '🔍', desc: 'SEO-optimized content' },
  { id: 'sell', name: 'Sell Something', icon: '💰', desc: 'Convert readers to buyers' },
  { id: 'custom', name: 'Custom Goal', icon: '⚙️', desc: 'Your specific objective' }
]

const LENGTHS = [
  { id: 'very-short', name: 'Very Short', desc: 'Under 100 words', icon: '⚡' },
  { id: 'short', name: 'Short', desc: '~300 words', icon: '📄' },
  { id: 'medium', name: 'Medium', desc: '600-800 words', icon: '📝' },
  { id: 'long', name: 'Long', desc: '1200+ words', icon: '📚' },
  { id: 'max', name: 'Maximum', desc: '2000+ words', icon: '📖' },
  { id: 'all', name: 'Comprehensive', desc: 'As long as needed', icon: '📚📚' },
  { id: 'custom', name: 'You Decide', desc: 'Specify exact count', icon: '⚙️' }
]

export default function ContentWizard({ isOpen, onClose, onGenerate, onBackToInitial, document }) {
  const session = useSession()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const customGoalInputRef = useRef(null)
  const [formData, setFormData] = useState({
    topic: '',
    audience: '',
    goals: [],
    platform: '',
    length: '',
    customLength: '',
    keywords: '',
    currentKeyword: '',
    customGoal: ''
  })

  const totalSteps = 6

  // Debug step changes
  useEffect(() => {
    console.log('Step changed to:', step)
  }, [step])

  // Auto-focus and scroll to custom goal input when custom goal is selected
  useEffect(() => {
    if (formData.goals.includes('custom') && customGoalInputRef.current) {
      setTimeout(() => {
        customGoalInputRef.current.focus()
        customGoalInputRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
    }
  }, [formData.goals])

  // Handle dialog close - prevent closing during generation
  const handleDialogClose = (open) => {
    if (!open && !isGenerating) {
      onClose()
    }
  }

  const handleBack = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Back button clicked, current step:', step)
    
    if (step === 1) {
      // On step 1, go back to the initial choice screen
      onClose() // Close the wizard
      if (onBackToInitial) {
        onBackToInitial() // Show the initial dialog again
      }
    } else if (step > 1) {
      setStep(step - 1)
      console.log('Moving to step:', step - 1)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Next button clicked, current step:', step)
    if (step < totalSteps) {
      setStep(step + 1)
      console.log('Moving to step:', step + 1)
    }
  }

  const handleSkip = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Skip button clicked, current step:', step)
    
    // Set default values for skipped steps
    if (step === 1 && !formData.topic.trim()) {
      setFormData(prev => ({ ...prev, topic: '' }))
    } else if (step === 2 && !formData.audience.trim()) {
      setFormData(prev => ({ ...prev, audience: '' }))
    } else if (step === 3 && formData.goals.length === 0) {
      setFormData(prev => ({ ...prev, goals: ['educate'], customGoal: '' }))
    } else if (step === 4 && !formData.platform) {
      setFormData(prev => ({ ...prev, platform: 'blog' }))
    } else if (step === 5 && !formData.length) {
      setFormData(prev => ({ ...prev, length: 'medium' }))
    }
    
    if (step < totalSteps) {
      setStep(step + 1)
      console.log('Skipping to step:', step + 1)
    }
  }

  const handleGoalToggle = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId) 
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const generatePrompt = () => {
    const selectedPlatform = PLATFORMS.find(p => p.id === formData.platform)
    const selectedGoals = GOALS.filter(g => formData.goals.includes(g.id))
    const selectedLength = LENGTHS.find(l => l.id === formData.length)

    let prompt = `Create engaging content about "${formData.topic}"`
    
    if (formData.audience) {
      prompt += ` for ${formData.audience}`
    }

    if (selectedGoals.length > 0) {
      const goalDescriptions = selectedGoals.map(g => {
        if (g.id === 'custom' && formData.customGoal) {
          return formData.customGoal.toLowerCase()
        }
        return g.name.toLowerCase()
      }).join(' and ')
      prompt += `. The goal is to ${goalDescriptions}`
    }

    if (selectedPlatform) {
      prompt += `. This will be published on ${selectedPlatform.name}`
      
      // Add platform-specific instructions
      if (selectedPlatform.id === 'linkedin') {
        prompt += '. Use a professional tone with engaging hooks and include relevant hashtags'
      } else if (selectedPlatform.id === 'instagram') {
        prompt += '. Use a casual, visual-friendly tone with emojis and hashtags'
      } else if (selectedPlatform.id === 'twitter') {
        prompt += '. Keep it concise, punchy, and engaging for social media'
      } else if (selectedPlatform.id === 'blog') {
        prompt += '. Structure it with clear headings, subheadings, and good flow'
      } else if (selectedPlatform.id === 'youtube') {
        prompt += '. Write it as a script with clear sections and engaging delivery'
      }
    }

    if (selectedLength) {
      if (selectedLength.id === 'custom' && formData.customLength) {
        prompt += `. Make it approximately ${formData.customLength}`
      } else if (selectedLength.id === 'max') {
        prompt += `. Make it comprehensive and detailed (2000+ words)`
      } else if (selectedLength.id === 'all') {
        prompt += `. Make it as comprehensive and detailed as possible, covering all aspects thoroughly`
      } else {
        prompt += `. ${selectedLength.desc}`
      }
    }

    if (formData.keywords) {
      prompt += `. Include these keywords or topics: ${formData.keywords}`
    }

    prompt += '. Make it engaging, well-structured, and optimized for the target platform. Return only the content in clean HTML format without any wrapper tags.'

    return prompt
  }

  const handleGenerate = async () => {
    if (!session?.user?.id) {
      console.error('No user session found')
      return
    }

    // Check if user has credits first
    try {
      const { getUserCredits } = await import('@/app/api/handlers/userHandlers')
      const creditResult = await getUserCredits(session.user.id)
      
      if (creditResult.credits <= 0) {
        setGeneratedContent("⚠️ You have no chat credits remaining. Your credits will reset at the beginning of next month.")
        setStep(7) // Show results with error
        return
      }
    } catch (error) {
      console.error("Error checking credits:", error)
    }

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const prompt = generatePrompt()
      
      // Create the system message with document context
      const contextualMessages = [
        {
          role: "system",
          content: `You are an AI writing assistant. Current document content: ${document || "Empty document"}. 

IMPORTANT: Return ONLY the content that would go inside the <body> tag. Do not include <html>, <head>, <body>, or any other wrapper tags. Just return the actual content elements like <h1>, <p>, <div>, etc.

Please provide improved version of the entire document based on the user's request.`,
        },
        {
          role: "user",
          content: prompt
        }
      ]

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: contextualMessages,
          userid: session.user.id,
        }),
      })

      if (!response.ok) {
        // Check if it's a credit error
        if (response.status === 400) {
          const errorData = await response.json()
          if (errorData.error && errorData.error.includes("no chat credits")) {
            setGeneratedContent("⚠️ You have no chat credits remaining. Your credits will reset at the beginning of next month.")
            setStep(7)
            return
          }
        }
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      let content = data.content || "Sorry, I couldn't generate a response."
      
      // Clean up markdown code blocks from the response
      content = content
        .replace(/```html\s*/gi, '') // Remove ```html
        .replace(/```\s*/g, '') // Remove closing ```
        .trim() // Remove extra whitespace
      
      setGeneratedContent(content)
      setStep(7) // Move to results step
    } catch (error) {
      console.error("Error generating content:", error)
      setGeneratedContent("Sorry, I encountered an error generating content. Please try again.")
      setStep(7) // Still show results step with error
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseContent = () => {
    // Pass the generated content to the parent component
    onGenerate(generatedContent)
    onClose()
    
    // Reset wizard state
    setStep(1)
    setGeneratedContent('')
    setFormData({
      topic: '',
      audience: '',
      goals: [],
      platform: '',
      length: '',
      customLength: '',
      keywords: '',
      currentKeyword: '',
      customGoal: ''
    })
  }

  const handleTryAgain = () => {
    setStep(6) // Go back to final step to regenerate
    setGeneratedContent('')
  }

  const canProceed = () => {
    switch (step) {
      case 1: return true // Can skip topic
      case 2: return true // Can skip audience
      case 3: return true // Can skip goals
      case 4: return true // Can skip platform
      case 5: return true // Can skip length
      case 6: return true
      default: return false
    }
  }

  const canSkip = () => {
    // All steps can be skipped now
    return [1, 2, 3, 4, 5].includes(step)
  }

  // Handle Enter key to go to next step
  const handleKeyDown = (e) => {
    // Only prevent default Enter behavior, don't auto-advance or generate
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Don't automatically advance steps or trigger generation
      // Users must click buttons explicitly
    }
  }

  // Get filtered length options based on platform
  const getFilteredLengthOptions = () => {
    const platform = formData.platform || 'blog' // Default to blog
    
    if (platform === 'twitter') {
      return LENGTHS.filter(l => ['very-short', 'custom'].includes(l.id))
    } else if (platform === 'linkedin') {
      return LENGTHS.filter(l => ['very-short', 'short', 'custom'].includes(l.id))
    } else if (platform === 'instagram') {
      return LENGTHS.filter(l => ['very-short', 'custom'].includes(l.id))
    } else if (platform === 'blog') {
      // Blog: up to 2000+ words, no comprehensive option
      return LENGTHS.filter(l => ['very-short', 'short', 'medium', 'long', 'max', 'custom'].includes(l.id))
    } else if (platform === 'newsletter') {
      // Newsletter: max 1200 words (up to Long, no Max 2000+)
      return LENGTHS.filter(l => ['very-short', 'short', 'medium', 'long', 'custom'].includes(l.id))
    } else if (platform === 'youtube') {
      // YouTube: short, long, and max (1200+ words)
      return LENGTHS.filter(l => ['short', 'long', 'max', 'custom'].includes(l.id))
    } else if (platform === 'medium') {
      // Medium: short, long, and max (1200+ words) 
      return LENGTHS.filter(l => ['short', 'long', 'max', 'custom'].includes(l.id))
    } else {
      // For custom platform - show all options
      return LENGTHS
    }
  }

  const renderStep = () => {
    // Loading step
    if (isGenerating) {
      return (
        <div className="space-y-6 text-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black">Creating Your Content</h3>
              <p className="text-gray-600">This may take a few moments...</p>
              <p className="text-sm text-yellow-600 font-medium">⚠️ Please don't close this window</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-500">
            <p>✨ Analyzing your requirements</p>
            <p>🎯 Crafting engaging content</p>
            <p>📝 Optimizing for your platform</p>
          </div>
        </div>
      )
    }

    // Results step
    if (step === 7) {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2 text-black">Content Generated!</h3>
            <p className="text-gray-600 text-sm">Review your content below and use it in your editor</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-black">Generated Content:</Label>
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 max-h-64 overflow-y-auto">
              <div 
                className="prose prose-sm max-w-none text-black"
                dangerouslySetInnerHTML={{ __html: generatedContent }}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleTryAgain}
              variant="outline"
              className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Generate Again
            </Button>
            <Button
              onClick={handleUseContent}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Use This Content
            </Button>
          </div>
        </div>
      )
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">What's your topic?</h3>
              <p className="text-gray-600 text-sm">Give me the main theme or title for your content</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-black">Topic or Title</Label>
              <Input
                id="topic"
                placeholder="e.g., Top 5 Mindfulness Practices for Busy People"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="text-left border-blue-200 focus:border-blue-500 text-black"
                autoFocus
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">Who's your audience?</h3>
              <p className="text-gray-600 text-sm">This helps me match the right tone and examples</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience" className="text-black">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Working moms, College students, Startup founders"
                value={formData.audience}
                onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="text-left border-blue-200 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">What's your goal?</h3>
              <p className="text-gray-600 text-sm">Pick one or more objectives (shapes tone & structure)</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((goal) => (
                <Card 
                  key={goal.id}
                  className={`cursor-pointer transition-all ${
                    formData.goals.includes(goal.id) 
                      ? 'border-blue-500 bg-blue-100' 
                      : 'border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100'
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <CardContent className="p-2 text-center">
                    <div className="text-xl mb-1">{goal.icon}</div>
                    <div className="font-medium text-xs text-black">{goal.name}</div>
                    <div className="text-[10px] text-gray-600">{goal.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {formData.goals.includes('custom') && (
              <div className="mt-4">
                <Label htmlFor="customGoal" className="text-black">
                  What's your specific goal?
                </Label>
                <Input
                  id="customGoal"
                  placeholder="e.g., Build trust with my audience, Showcase expertise, Generate leads"
                  value={formData.customGoal}
                  onChange={(e) => setFormData(prev => ({ ...prev, customGoal: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  className="border-blue-200 mt-2 focus:border-blue-500 text-black"
                  ref={customGoalInputRef}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Describe what you want to achieve with this content
                </p>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">Where will you publish?</h3>
              <p className="text-gray-600 text-sm">Platform affects format, tone, and length</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {PLATFORMS.map((platform) => (
                <Card 
                  key={platform.id}
                  className={`cursor-pointer transition-all ${
                    formData.platform === platform.id 
                      ? 'border-blue-500 bg-blue-100' 
                      : 'border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, platform: platform.id }))}
                >
                  <CardContent className="p-2 text-center">
                    <div className="text-xl mb-1">{platform.icon}</div>
                    <div className="font-medium text-xs text-black">{platform.name}</div>
                    <div className="text-[10px] text-gray-600">{platform.length}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">How long should it be?</h3>
              {(() => {
                const selectedPlatform = PLATFORMS.find(p => p.id === (formData.platform || 'blog'))
                const platformName = selectedPlatform?.name || 'Blog Post'
                const platformLength = selectedPlatform?.length || 'Medium (600-800 words)'
                
                return (
                  <p className="text-gray-600 text-sm">
                    Suggested for {platformName}: {platformLength}
                  </p>
                )
              })()}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {getFilteredLengthOptions().map((length) => (
                <Card 
                  key={length.id}
                  className={`cursor-pointer transition-all ${
                    formData.length === length.id 
                      ? 'border-blue-500 bg-blue-100' 
                      : 'border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, length: length.id }))}
                >
                  <CardContent className="p-2 text-center">
                    <div className="text-xl mb-1">{length.icon}</div>
                    <div className="font-medium text-xs text-black">{length.name}</div>
                    <div className="text-[10px] text-gray-600">{length.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {formData.length === 'custom' && (
              <div className="mt-4">
                <Label htmlFor="customLength" className="text-black">
                  Specify Length
                </Label>
                <Input
                  id="customLength"
                  placeholder={
                    (formData.platform || 'blog') === 'twitter' 
                      ? 'e.g., 280 characters' 
                      : (formData.platform || 'blog') === 'linkedin'
                      ? 'e.g., 250 words'
                      : (formData.platform || 'blog') === 'instagram'
                      ? 'e.g., 100 words'
                      : 'e.g., 500 words, 5 paragraphs, 3 pages'
                  }
                  value={formData.customLength}
                  onChange={(e) => setFormData(prev => ({ ...prev, customLength: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  className="border-blue-200 focus:border-blue-500 text-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific: words, characters, paragraphs, pages, etc.
                </p>
              </div>
            )}
          </div>
        )

      case 6:
        return (
          <div className="space-y-4" onKeyDown={handleKeyDown}>
            <div className="text-center">
              <Hash className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-black">Any specific keywords?</h3>
              <p className="text-gray-600 text-sm">Optional: Add keywords or subtopics to include (helps with SEO)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords" className="text-black">Keywords or Subtopics (Optional)</Label>
              <div className="space-y-2">
                <Input
                  id="keywords"
                  placeholder="Type a keyword and press Enter to add (e.g., digital detox)"
                  value={formData.currentKeyword || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentKeyword: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && formData.currentKeyword?.trim()) {
                      e.preventDefault()
                      const newKeyword = formData.currentKeyword.trim()
                      const existingKeywords = formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : []
                      
                      if (!existingKeywords.includes(newKeyword)) {
                        const updatedKeywords = [...existingKeywords, newKeyword].join(', ')
                        setFormData(prev => ({ 
                          ...prev, 
                          keywords: updatedKeywords,
                          currentKeyword: ''
                        }))
                      } else {
                        setFormData(prev => ({ ...prev, currentKeyword: '' }))
                      }
                    } else if (e.key === 'Enter' && !formData.currentKeyword?.trim()) {
                      // If no keyword being typed, proceed to next step
                      handleKeyDown(e)
                    }
                  }}
                  className="border-blue-200 focus:border-blue-500 text-black"
                />
                {formData.keywords && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.keywords.split(',').map((keyword, index) => {
                      const trimmedKeyword = keyword.trim()
                      if (!trimmedKeyword) return null
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md border border-blue-200"
                        >
                          {trimmedKeyword}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const keywords = formData.keywords.split(',').map(k => k.trim()).filter((k, i) => i !== index && k)
                              setFormData(prev => ({ ...prev, keywords: keywords.length > 0 ? keywords.join(', ') : '' }))
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none"
                          >
                            ×
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Summary */}
            <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 flex items-center text-black">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Ready to generate!
              </h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong className="text-black">Topic:</strong> {formData.topic || ''}</p>
                <p><strong className="text-black">Audience:</strong> {formData.audience || ''}</p>
                <p><strong className="text-black">Goals:</strong> {formData.goals.length > 0 ? formData.goals.map(g => {
                  if (g === 'custom' && formData.customGoal) {
                    return formData.customGoal
                  }
                  return GOALS.find(goal => goal.id === g)?.name
                }).filter(Boolean).join(', ') : 'Educate'}</p>
                <p><strong className="text-black">Platform:</strong> {PLATFORMS.find(p => p.id === (formData.platform || 'blog'))?.name || 'Blog Post'}</p>
                <p><strong className="text-black">Length:</strong> {LENGTHS.find(l => l.id === (formData.length || 'medium'))?.name || 'Medium'}</p>
                {formData.keywords && <p><strong className="text-black">Keywords:</strong> {formData.keywords}</p>}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose} className="bg-white">
      <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black">
            <Wand2 className="w-5 h-5 text-blue-600" />
            Content Creation Wizard
            {isGenerating && (
              <span className="text-sm text-yellow-600 font-normal">- Generating Content...</span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress bar - hide during generation and results */}
        {!isGenerating && step !== 7 && (
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i + 1 <= step ? 'bg-blue-600' : 'bg-blue-200'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">{step}/{totalSteps}</span>
          </div>
        )}

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {renderStep()}
        </div>

        {/* Navigation buttons - hide during generation and results */}
        {!isGenerating && step !== 7 && (
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 bg-white shadow-md border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? 'Choose Method' : 'Back'}
            </Button>
            
            <div className="flex gap-2">
              {canSkip() && (
                <Button
                  type="button"
                  onClick={handleSkip}
                  className="flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 