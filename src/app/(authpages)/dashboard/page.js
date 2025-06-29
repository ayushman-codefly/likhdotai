"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditorPage from "@/app/_reusables/Editor"
import OnboardingPage from "@/components/onboarding-page"
import ContentWizard from "@/components/content-wizard"
import InitialPromptDialog from "@/components/initial-prompt-dialog"
import { getUserFromDB, getUserCredits } from "@/app/api/handlers/userHandlers"
import useSession from "@/lib/supabase/use-session"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import {
  Send,
  FileText,
  Sparkles,
  Check,
  X,
  Bot,
  Loader2,
  Zap,
  LogOut,
  User,
  Wand2,
  Settings,
} from "lucide-react"

// LCS-based HTML-aware diff function
function createIntelligentDiff(original, modified) {
  // Parse HTML content into meaningful chunks
  const parseHTML = (html) => {
    if (!html || html.trim() === '') return []
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
    const chunks = []
    
    const traverse = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim()
        if (text) {
          chunks.push({
            type: 'text',
            content: text,
            html: text,
            key: `text:${text}` // Unique key for comparison
          })
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase()
        const attributes = Array.from(node.attributes)
          .map(attr => `${attr.name}="${attr.value}"`)
          .join(' ')
        
        const textContent = node.textContent.trim()
        chunks.push({
          type: 'element',
          tagName,
          content: node.innerHTML,
          html: node.outerHTML,
          openTag: `<${tagName}${attributes ? ' ' + attributes : ''}>`,
          closeTag: `</${tagName}>`,
          textContent,
          key: `${tagName}:${textContent}:${node.innerHTML}` // Unique key for comparison
        })
      }
    }
    
    Array.from(doc.body.firstChild.childNodes).forEach(traverse)
    return chunks
  }

  const originalChunks = parseHTML(original || '')
  const modifiedChunks = parseHTML(modified || '')

  // LCS Algorithm to find longest common subsequence
  function computeLCS(arr1, arr2) {
    const m = arr1.length
    const n = arr2.length
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
    
    // Build LCS table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (areChunksEqual(arr1[i - 1], arr2[j - 1])) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
      }
    }
    
    // Backtrack to find LCS
    const lcs = []
    let i = m, j = n
    while (i > 0 && j > 0) {
      if (areChunksEqual(arr1[i - 1], arr2[j - 1])) {
        lcs.unshift({ originalIndex: i - 1, modifiedIndex: j - 1 })
        i--
        j--
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--
      } else {
        j--
      }
    }
    
    return lcs
  }

  // Check if two chunks are equal
  function areChunksEqual(chunk1, chunk2) {
    if (!chunk1 || !chunk2) return false
    
    // For text nodes, compare content directly
    if (chunk1.type === 'text' && chunk2.type === 'text') {
      return chunk1.content === chunk2.content
    }
    
    // For elements, compare tag name and content
    if (chunk1.type === 'element' && chunk2.type === 'element') {
      return chunk1.tagName === chunk2.tagName && 
             chunk1.content === chunk2.content
    }
    
    return false
  }

  // Generate diff using LCS
  const lcs = computeLCS(originalChunks, modifiedChunks)
  const changes = []
  let changeId = 0
  let originalIndex = 0
  let modifiedIndex = 0
  let lcsIndex = 0

  while (originalIndex < originalChunks.length || modifiedIndex < modifiedChunks.length) {
    // Check if we have a match in LCS
    const currentLCS = lcs[lcsIndex]
    
    if (currentLCS && 
        originalIndex === currentLCS.originalIndex && 
        modifiedIndex === currentLCS.modifiedIndex) {
      // This is an unchanged chunk
      changes.push({
        id: changeId++,
        type: 'unchanged',
        content: originalChunks[originalIndex].html,
        textContent: originalChunks[originalIndex].textContent || originalChunks[originalIndex].content,
        chunk: originalChunks[originalIndex]
      })
      originalIndex++
      modifiedIndex++
      lcsIndex++
    } else if (originalIndex < originalChunks.length && 
               (modifiedIndex >= modifiedChunks.length || 
                !currentLCS || 
                originalIndex < currentLCS.originalIndex)) {
      // This chunk was removed
      changes.push({
        id: changeId++,
        type: 'removed',
        content: originalChunks[originalIndex].html,
        textContent: originalChunks[originalIndex].textContent || originalChunks[originalIndex].content,
        chunk: originalChunks[originalIndex]
      })
      originalIndex++
    } else if (modifiedIndex < modifiedChunks.length) {
      // This chunk was added
      changes.push({
        id: changeId++,
        type: 'added',
        content: modifiedChunks[modifiedIndex].html,
        textContent: modifiedChunks[modifiedIndex].textContent || modifiedChunks[modifiedIndex].content,
        chunk: modifiedChunks[modifiedIndex]
      })
      modifiedIndex++
    }
  }

  // Post-process to identify modifications (adjacent remove + add of same element type)
  const processedChanges = []
  let i = 0
  
  while (i < changes.length) {
    const current = changes[i]
    const next = changes[i + 1]
    
    // Check if this is a modification (remove followed by add of same element type)
    if (current.type === 'removed' && 
        next && 
        next.type === 'added' && 
        current.chunk.type === 'element' && 
        next.chunk.type === 'element' && 
        current.chunk.tagName === next.chunk.tagName) {
      
      processedChanges.push({
        id: changeId++,
        type: 'modified',
        originalContent: current.content,
        modifiedContent: next.content,
        originalText: current.textContent,
        modifiedText: next.textContent,
        tagName: current.chunk.tagName
      })
      i += 2 // Skip both current and next
    } else {
      processedChanges.push(current)
      i++
    }
  }

  return processedChanges
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600">Loading your workspace...</p>
      </div>
    </div>
  )
}

export default function Page() {
  const [document, setDocument] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDiffView, setShowDiffView] = useState(false)
  const [diffChanges, setDiffChanges] = useState([])
  const [acceptedChanges, setAcceptedChanges] = useState(new Set())
  const [rejectedChanges, setRejectedChanges] = useState(new Set())
  const [originalDocument, setOriginalDocument] = useState("")
  const [modifiedDocument, setModifiedDocument] = useState("")

  // User checking states
  const [userExists, setUserExists] = useState(null) // null = loading, true = exists, false = doesn't exist
  const [userLoading, setUserLoading] = useState(true)
  const [userError, setUserError] = useState(null)

  // Content wizard states
  const [showInitialDialog, setShowInitialDialog] = useState(false)
  const [showContentWizard, setShowContentWizard] = useState(false)
  const [hasShownInitialDialog, setHasShownInitialDialog] = useState(false)
  const [userCredits, setUserCredits] = useState(0)
  const [creditsLoading, setCreditsLoading] = useState(true)

  const chatContainerRef = useRef(null)
  const chatInputRef = useRef(null)
  const session = useSession()

  // Check if user exists in database
  useEffect(() => {
    if(!session){
      return
    }
    async function checkUserExists() {
      if (!session?.user?.id) {
        setUserLoading(false)
        setUserError("No user session found")
        return
      }

      try {
        setUserLoading(true)
        const result = await getUserFromDB(session.user.id)
        
        // Handle both expected format {dbUser, error} and raw Supabase format
        let dbUser, error
        
        if (result && typeof result === 'object') {
          if ('dbUser' in result && 'error' in result) {
            // Expected format
            dbUser = result.dbUser
            error = result.error
          } else if ('data' in result) {
            // Raw Supabase format
            if (result.error) {
              error = result.error
              dbUser = null
            } else if (result.data && result.data.length > 0) {
              dbUser = result.data[0] // User exists
              error = null
            } else {
              dbUser = null // User doesn't exist
              error = null
            }
          } else {
            // Unexpected format
            error = new Error("Unexpected response format")
            dbUser = null
          }
        } else {
          error = new Error("Invalid response")
          dbUser = null
        }
        
        if (error) {
          console.error("Error checking user:", error)
          setUserError(error.message || "Failed to check user")
          setUserExists(false)
        } else {
          setUserExists(!!dbUser) // true if user exists, false if null
          // Also check user credits if user exists
          if (dbUser) {
            checkUserCredits()
          }
        }
      } catch (err) {
        console.error("Error in checkUserExists:", err)
        setUserError(err.message || "Failed to check user")
        setUserExists(false)
      } finally {
        setUserLoading(false)
      }
    }

    async function checkUserCredits() {
      if (!session?.user?.id) {
        setCreditsLoading(false)
        return
      }

      try {
        const result = await getUserCredits(session.user.id)
        
        if (result.error) {
          console.error("Error fetching credits:", result.error)
          setUserCredits(0)
        } else {
          setUserCredits(result.credits)
        }
      } catch (error) {
        console.error("Error checking credits:", error)
        setUserCredits(0)
      } finally {
        setCreditsLoading(false)
      }
    }

    checkUserExists()
  }, [session])

  // Function to recheck user after onboarding completion
  const checkUserOnboarded = async () => {
    setUserLoading(true)
    try {
      const result = await getUserFromDB(session.user.id)
      
      // Handle both expected format {dbUser, error} and raw Supabase format
      let dbUser, error
      
      if (result && typeof result === 'object') {
        if ('dbUser' in result && 'error' in result) {
          // Expected format
          dbUser = result.dbUser
          error = result.error
        } else if ('data' in result) {
          // Raw Supabase format
          if (result.error) {
            error = result.error
            dbUser = null
          } else if (result.data && result.data.length > 0) {
            dbUser = result.data[0] // User exists
            error = null
          } else {
            dbUser = null // User doesn't exist
            error = null
          }
        }
      }
      
      if (!error && dbUser) {
        setUserExists(true)
      }
    } catch (err) {
      console.error("Error rechecking user:", err)
    } finally {
      setUserLoading(false)
    }
  }

  // Function to process escape characters in text
  const processEscapeCharacters = (text) => {
    if (!text) return text
    return text
      .replace(/\\n/g, '<br>') // Convert \n to <br>
      .replace(/\\"/g, '"') // Convert \" to "
      .replace(/\\'/g, "'") // Convert \' to '
      .replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // Convert \t to spaces
      .replace(/\\\\/g, '\\') // Convert \\ to \
  }

  // Custom chat implementation for Gemma2:9b
  const handleSubmit = async (e) => {
        e.preventDefault()
    if (!input.trim() || isLoading) return

    // Check if user has credits
    if (userCredits <= 0) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ You have no chat credits remaining. Your credits will reset at the beginning of next month.",
        hasChanges: false,
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Clear the contentEditable div
    if (chatInputRef.current) {
      chatInputRef.current.textContent = ""
    }

    setIsLoading(true)

    try {
      // Send full document context with the message
      const contextualMessages = [
        {
          role: "system",
          content: `You are an AI writing assistant. You help users improve their documents through conversation.

CURRENT DOCUMENT CONTENT:
${document || "Empty document"}

IMPORTANT INSTRUCTIONS:
- Always consider the current document content when responding
- Return ONLY the content that would go inside the <body> tag
- Do not include <html>, <head>, <body>, or any other wrapper tags
- Just return the actual content elements like <h1>, <p>, <div>, etc.
- When providing improvements, consider the entire document context
- Provide improved version of the entire document based on the user's request`,
        },
        ...messages.map(msg => ({
          ...msg,
          // Add document context to user messages for better conversation flow
          content: msg.role === 'user' ? 
            `[Document context: ${document ? `${document.substring(0, 200)}${document.length > 200 ? '...' : ''}` : 'Empty document'}]\n\nUser message: ${msg.content}` : 
            msg.content
        })),
        {
          ...userMessage,
          content: `[Current document: ${document ? `${document.substring(0, 200)}${document.length > 200 ? '...' : ''}` : 'Empty document'}]\n\nUser message: ${userMessage.content}`
        },
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

      console.log({response}) 

      if (!response.ok) {
        // Check if it's a credit error
        if (response.status === 400) {
          const errorData = await response.json()
          if (errorData.error && errorData.error.includes("no chat credits")) {
            const errorMessage = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: "⚠️ You have no chat credits remaining. Your credits will reset at the beginning of next month.",
              hasChanges: false,
            }
            setMessages((prev) => [...prev, errorMessage])
            setUserCredits(0) // Update local state
            return
          }
        }
        throw new Error("Failed to get response")
      }

      // Create initial assistant message with empty content
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        hasChanges: false,
        suggestedDocument: "",
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Handle non-streaming response
      const data = await response.json()
      console.log({data})
      
      let assistantContent = data.content || "Sorry, I couldn't generate a response."
      
      // Clean up markdown code blocks from the response
      assistantContent = assistantContent
        .replace(/```html\s*/gi, '') // Remove ```html
        .replace(/```\s*/g, '') // Remove closing ```
        .trim() // Remove extra whitespace
      
      // Process escape characters
      assistantContent = processEscapeCharacters(assistantContent)
      
      // Update the message with the complete response
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                content: assistantContent, 
                suggestedDocument: assistantContent,
                hasChanges: true 
              }
            : msg
        )
      )
      
      // Update credits after successful response (deduct 1)
      setUserCredits(prev => Math.max(0, prev - 1))
      
      // Auto-scroll after response is complete
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        hasChanges: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const content = e.target.textContent || ""
    setInput(content)
  }

  const applyChangesToEditor = (messageId, suggestedContent) => {
    setOriginalDocument(document)
    setModifiedDocument(suggestedContent)

    const changes = createIntelligentDiff(document, suggestedContent)
    setDiffChanges(changes)
    setShowDiffView(true)

    // Update message to show changes are being reviewed
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, changesApplied: true, hasChanges: false } : msg)),
    )
  }

  const acceptAllChanges = () => {
    // Build the final document from accepted changes
    let finalDocument = ""
    
    diffChanges.forEach(change => {
      if (change.type === "unchanged") {
        finalDocument += change.content
      } else if (change.type === "added" || change.type === "modified") {
        finalDocument += change.type === "modified" ? change.modifiedContent : change.content
      }
      // Skip removed changes (don't add them to final document)
    })
    
    setDocument(finalDocument)
    setShowDiffView(false)
    setDiffChanges([])
    setAcceptedChanges(new Set())
    setRejectedChanges(new Set())
  }

  const rejectAllChanges = () => {
    setShowDiffView(false)
    setDiffChanges([])
    setAcceptedChanges(new Set())
    setRejectedChanges(new Set())
  }

  const applySelectedChanges = () => {
    // Build the final document based on accepted/rejected changes
    let finalDocument = ""
    
    diffChanges.forEach(change => {
      if (change.type === "unchanged") {
        finalDocument += change.content
      } else if (change.type === "removed") {
        // Only keep removed content if it wasn't explicitly rejected
        if (!rejectedChanges.has(change.id)) {
          finalDocument += change.content
        }
      } else if (change.type === "added") {
        // Only add new content if it was explicitly accepted
        if (acceptedChanges.has(change.id)) {
          finalDocument += change.content
        }
      } else if (change.type === "modified") {
        // Use modified content if accepted, original if rejected/not decided
        if (acceptedChanges.has(change.id)) {
          finalDocument += change.modifiedContent
        } else {
          finalDocument += change.originalContent
        }
      }
    })
    
    setDocument(finalDocument)
    setShowDiffView(false)
    setDiffChanges([])
    setAcceptedChanges(new Set())
    setRejectedChanges(new Set())
  }

  // Handle keyboard events
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleKeyDown = (e) => {
      if (showDiffView && e.key === "Escape") {
        e.preventDefault()
        rejectAllChanges()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showDiffView])

  // Check if we should show the initial dialog
  useEffect(() => {
    // Show initial dialog when document is empty and user hasn't seen it yet
    if (!hasShownInitialDialog && document.trim() === '' && messages.length === 0 && userExists) {
      const timer = setTimeout(() => {
        setShowInitialDialog(true)
        setHasShownInitialDialog(true)
      }, 1000) // Small delay to let the page load

      return () => clearTimeout(timer)
    }
  }, [document, messages.length, hasShownInitialDialog, userExists])

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return

    setShowAIDialog(false)
    setIsGenerating(true)

    const contextPrompt = `Generate content for: ${aiPrompt}`

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: contextPrompt,
          context: document,
        }),
      })

      const data = await response.json()
      const generatedContent = data.content || ""

      // Append generated content to the document
      const currentContent = document || ""
      const newContent = currentContent + (currentContent ? "\n\n" : "") + generatedContent
      setDocument(newContent)
    } catch (error) {
      console.error("Error generating content:", error)
    }

    setAiPrompt("")
    setIsGenerating(false)
  }

  const generateContent = async (prompt) => {
    setIsGenerating(true)
    const contextPrompt = document
      ? `Here's the existing document:\n\n${document}\n\nUser request: ${prompt}\n\nPlease provide an improved version of the entire document.`
      : `Create content for: ${prompt}`

    setInput(contextPrompt)
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} })
      setIsGenerating(false)
    }, 100)
  }

  // Content wizard handlers
  const handleUseWizard = () => {
    setShowInitialDialog(false)
    setShowContentWizard(true)
  }

  const handleWriteOwnPrompt = () => {
    setShowInitialDialog(false)
    // Focus on the chat input
    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus()
      }
    }, 100)
  }

  const handleWizardGenerate = (generatedContent) => {
    // Directly set the generated content to the document
    setDocument(generatedContent)
    setShowContentWizard(false)
  }

  const handleBackToInitial = () => {
    // Show the initial dialog again when user goes back from wizard step 1
    setShowInitialDialog(true)
  }

  // Show loading spinner while checking user
  if (userLoading) {
    return <LoadingSpinner />
  }

  // Show onboarding if user doesn't exist
  if (userExists === false) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OnboardingPage 
          userId={session?.user?.id}
          email={session?.user?.email}
          checkUserOnboarded={checkUserOnboarded}
        />
      </Suspense>
    )
  }

  // Show error state if there's an error
  if (userError) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 text-center">
          <X className="w-8 h-8 text-red-600" />
          <p className="text-sm text-red-600">Error loading user data</p>
          <p className="text-xs text-gray-500">{userError}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Render dashboard if user exists
  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50">
      {/* Diff View Overlay */}
      {showDiffView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-black">Review Changes</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={rejectAllChanges}
                  className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject All
                </Button>
                <Button size="sm" onClick={acceptAllChanges} className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-1" />
                  Accept All
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {diffChanges.map((change) => {
                  const isAccepted = acceptedChanges.has(change.id)
                  const isRejected = rejectedChanges.has(change.id)
                  
                  if (change.type === "unchanged") {
                    return (
                      <div key={change.id} className="p-3 bg-gray-50 rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-500 font-medium">Unchanged</span>
                        </div>
                        <div 
                          className="text-sm text-gray-700"
                          dangerouslySetInnerHTML={{ __html: change.content }}
                        />
                      </div>
                    )
                  }
                  
                  if (change.type === "modified") {
  return (
                      <div key={change.id} className={`p-3 rounded border ${
                        isAccepted ? "bg-green-50 border-green-200" : 
                        isRejected ? "bg-red-50 border-red-200" : 
                        "bg-yellow-50 border-yellow-200"
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-xs text-yellow-700 font-medium">Modified {change.tagName}</span>
                          </div>
                          {!isAccepted && !isRejected && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRejectedChanges(prev => new Set(prev).add(change.id))}
                                className="h-6 px-2 text-xs border-red-200 text-red-700 hover:bg-red-100"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setAcceptedChanges(prev => new Set(prev).add(change.id))}
                                className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="p-2 bg-red-100 rounded border-l-4 border-red-400">
                            <div className="text-xs text-red-600 font-medium mb-1">Original:</div>
                            <div 
                              className="text-sm text-red-800"
                              dangerouslySetInnerHTML={{ __html: change.originalContent }}
                            />
                          </div>
                          <div className="p-2 bg-green-100 rounded border-l-4 border-green-400">
                            <div className="text-xs text-green-600 font-medium mb-1">Modified:</div>
                            <div 
                              className="text-sm text-green-800"
                              dangerouslySetInnerHTML={{ __html: change.modifiedContent }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }
                  
                  return (
                    <div key={change.id} className={`p-3 rounded border ${
                      change.type === "removed" 
                        ? (isRejected ? "bg-gray-50 border-gray-200" : "bg-red-50 border-red-200")
                        : (isAccepted ? "bg-gray-50 border-gray-200" : "bg-green-50 border-green-200")
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {change.type === "removed" ? (
                            <>
                              <X className="w-3 h-3 text-red-600" />
                              <span className="text-xs text-red-600 font-medium">Removed</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Added</span>
                            </>
                          )}
                        </div>
                        {change.type === "added" && !isAccepted && !isRejected && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRejectedChanges(prev => new Set(prev).add(change.id))}
                              className="h-6 px-2 text-xs border-red-200 text-red-700 hover:bg-red-100"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setAcceptedChanges(prev => new Set(prev).add(change.id))}
                              className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div 
                        className={`text-sm ${
                          change.type === "removed" 
                            ? (isRejected ? "text-gray-600" : "text-red-800")
                            : (isAccepted ? "text-gray-600" : "text-green-800")
                        }`}
                        dangerouslySetInnerHTML={{ __html: change.content }}
                      />
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Use inline buttons to accept/reject individual changes, or use the buttons below for all changes.
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={rejectAllChanges}
                    className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={applySelectedChanges}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={acceptedChanges.size === 0 && rejectedChanges.size === 0}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Apply Selected Changes
                  </Button>
                  <Button
                    size="sm" 
                    onClick={acceptAllChanges}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept All
                  </Button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial Prompt Dialog */}
      <InitialPromptDialog
        isOpen={showInitialDialog}
        onClose={() => setShowInitialDialog(false)}
        onUseWizard={handleUseWizard}
        onWriteOwn={handleWriteOwnPrompt}
      />

      {/* Content Creation Wizard */}
      <ContentWizard
        isOpen={showContentWizard}
        onClose={() => setShowContentWizard(false)}
        onGenerate={handleWizardGenerate}
        onBackToInitial={handleBackToInitial}
        document={document}
      />

      {/* AI Generate Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Generate with AI
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="What would you like me to generate?"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAIGenerate()
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAIDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAIGenerate} disabled={!aiPrompt.trim()} className="bg-blue-600 hover:bg-blue-700">
                Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border-b p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h1 className="font-semibold text-black">Document Editor</h1>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">AI Powered</span>
        </div>

          {/* User Info and Settings/Logout Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-3 h-3 text-yellow-600" />
              <span className={`font-medium whitespace-nowrap ${userCredits <= 0 ? 'text-red-600' : userCredits <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                {creditsLoading ? '...' : "Credits : "+userCredits}
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.user_metadata?.image || session?.user?.user_metadata?.avatar_url} alt={session?.user?.email} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {session?.user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{session?.user?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {session?.user?.user_metadata?.fullname || session?.user?.user_metadata?.full_name || "User"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/settings'} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={async () => {
                    try {
                      const supabase = createSupabaseBrowserClient()
                      await supabase.auth.signOut()
                      window.location.href = '/'
                    } catch (error) {
                      console.error('Error signing out:', error)
                      window.location.href = '/api/auth/signout'
                    }
                  }}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full overflow-auto">
            <EditorPage
              content={document}
              setContent={setDocument}
            />
            </div>
          </div>
      </div>

      <Separator orientation="vertical" />

      {/* AI Chat Panel */}
      <div className="w-96 flex flex-col bg-white min-h-0 flex-shrink-0">
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <h2 className="font-semibold text-black truncate">AI Assistant</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex-shrink-0">AI</span>
            </div>
            <div className="flex items-center gap-1 text-xs flex-shrink-0 ml-2">
              <Zap className="w-3 h-3 text-yellow-600" />
              <span className={`font-medium whitespace-nowrap ${userCredits <= 0 ? 'text-red-600' : userCredits <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                {creditsLoading ? '...' : "Credits : "+userCredits}
              </span>
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-1">Chat with your AI assistant</p>
        </div>

        <ScrollArea className="flex-1 p-4 min-h-0" ref={chatContainerRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-blue-500 py-8">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-black">Start a conversation with AI</p>
                <p className="text-xs mt-1 text-blue-400">
                  AI will analyze your entire document and suggest improvements
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${message.role === "user" ? "" : "w-full"}`}>
                <Card
                    className={`p-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="text-sm whitespace-pre-wrap text-white">{message.content}</p>
                    ) : (
                      <div>
                        {message.content ? (
                          <div 
                            className="text-sm text-black max-w-none [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-sm [&>h3]:font-bold [&>h3]:mb-1 [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>li]:ml-4"
                            dangerouslySetInnerHTML={{ __html: message.content }}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        )}
                      </div>
                    )}
                </Card>

                  {/* Apply Changes Button for Assistant Messages */}
                  {message.role === "assistant" && message.hasChanges && (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        onClick={() => applyChangesToEditor(message.id, message.suggestedDocument)}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Apply Changes to Editor
                      </Button>
                    </div>
                  )}

                  {/* Show when changes are applied */}
                  {message.changesApplied && (
                    <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Changes applied - Review in diff view
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-blue-50 border-blue-200 p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <div
                ref={chatInputRef}
                contentEditable={userCredits > 0}
                onInput={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
                className={`w-full min-h-[40px] max-h-[120px] p-3 border border-blue-200 rounded-md text-sm focus-visible:outline-none ring-2 ring-blue-300 focus-visible:ring-blue-500 focus-visible:border-blue-500 overflow-y-auto resize-none text-black ${userCredits <= 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
                data-placeholder={userCredits <= 0 ? "No credits remaining..." : "Ask AI to improve your document..."}
                suppressContentEditableWarning={true}
              />
              {!input.trim() && (
                <div className="absolute top-3 left-3 text-gray-500 text-sm pointer-events-none">
                  {userCredits <= 0 ? "No credits remaining..." : "Ask AI to improve your document..."}
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || userCredits <= 0}
              className={`self-end bg-blue-600 ${isLoading || !input.trim() || userCredits <= 0 ? "text-black":"text-white"} hover:bg-blue-700`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-1 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowContentWizard(true)}
              disabled={isLoading || userCredits <= 0}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 text-xs px-2"
            >
              <Wand2 className="w-3 h-3 mr-1" />
              Wizard
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateContent("Improve this document")}
              disabled={isLoading || !document.trim() || userCredits <= 0}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs px-2"
            >
              Improve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateContent("Fix grammar and spelling")}
              disabled={isLoading || !document.trim() || userCredits <= 0}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs px-2"
            >
              Grammar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateContent("Make it more concise")}
              disabled={isLoading || !document.trim() || userCredits <= 0}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs px-2"
            >
              Shorten
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
