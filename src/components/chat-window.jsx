"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Bot, User, MoreVertical, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import MicrophoneButton, { LanguageSelector } from "@/components/MicrophoneButton"
import useSession from "@/lib/supabase/use-session"

export default function ChatWindow({ documentContent = "", onSuggestion }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hello! I'm your AI writing assistant. How can I help you with your document today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const session = useSession()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle STT transcript
  const handleSttTranscript = (transcript) => {
    if (transcript) {
      setInputValue(transcript)
      if (textareaRef.current) {
        textareaRef.current.value = transcript
      }
    }
  }

  // Handle file upload (dummy functionality)
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Check if it's PDF or Word document
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ]
      
      if (allowedTypes.includes(file.type)) {
        // For now, just show a message that file was received
        const fileMessage = {
          id: Date.now().toString(),
          content: `📎 Document uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, fileMessage])
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        // Show error for unsupported file types
        const errorMessage = {
          id: Date.now().toString(),
          content: "❌ Only PDF and Word documents (.pdf, .doc, .docx) are supported.",
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    }
  }

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    // Create initial AI message with loading state
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "assistant",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userid: session.user.id
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an AI writing assistant. The user has a document with the following content:\n\n${documentContent}\n\nPlease help them improve or modify this document based on their request. 

IMPORTANT: Return ONLY the content that would go inside the <body> tag. Do not include <html>, <head>, <body>, or any other wrapper tags. Just return the actual content elements like <h1>, <p>, <div>, etc.

Respond with the improved/modified content in clean HTML format.`
            },
            {
              role: "user",
              content: currentInput
            }
          ]
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setIsLoading(false) // Stop loading when we start receiving stream

      console.log({response})

      // Handle streaming response as plain text
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiContent = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Decode chunk as plain text
          const textChunk = decoder.decode(value, { stream: true })
          console.log("Received text chunk:", textChunk)
          
          // Simply concatenate the text chunk
          aiContent += textChunk
          console.log("Updated aiContent:", aiContent)
          
          // Update the message in real-time
          setMessages((prev) => {
            const updated = prev.map((msg) => 
              msg.id === aiMessage.id 
                ? { ...msg, content: aiContent }
                : msg
            )
            console.log("Updated messages:", updated)
            return updated
          })

          // Auto-scroll during streaming
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
          }
        }
      } catch (streamError) {
        console.error("Error reading stream:", streamError)
      }

      // Create suggestion after streaming is complete
      if (onSuggestion && aiContent.trim()) {
        const suggestion = {
          id: `suggestion-${Date.now()}`,
          original: documentContent,
          suggested: aiContent,
          userRequest: currentInput,
          timestamp: new Date(),
        }
        onSuggestion(suggestion)
      }

    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI writing assistant. How can I help you with your document today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-white flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <Avatar className="h-8 w-8 bg-blue-100 flex-shrink-0">
            <AvatarFallback className="text-blue-600">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 truncate">AI Assistant</h3>
            <p className="text-xs text-slate-500 truncate">Online</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={clearChat}>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem>Export Chat</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 min-h-0 overflow-hidden">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback
                    className={`text-xs ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </AvatarFallback>
                </Avatar>
                <Card
                  className={`p-3 min-w-0 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap text-white break-words">{message.content}</p>
                  ) : (
                    <div>
                      {message.content ? (
                        <div 
                          className="text-sm text-black max-w-none break-words [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-sm [&>h3]:font-bold [&>h3]:mb-1 [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>li]:ml-4"
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
              </div>
            </div>
          ))}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-blue-200 bg-white flex-shrink-0 overflow-hidden">
        {/* Language Selector - Outside input area */}
        <div className="flex items-center justify-between mb-2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            disabled={isLoading}
          />
          <span className="text-xs text-gray-500 truncate">Select language for voice input</span>
        </div>
        
        <div className="flex space-x-2 relative">
          <div className="flex-1 relative min-w-0">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI..."
              className="flex-1 min-h-[60px] max-h-32 resize-none text-black border-blue-200 focus:border-blue-400 focus:ring-blue-400 pr-20 w-full"
              disabled={isLoading}
            />
            
            {/* File Upload and Microphone Buttons */}
            <div className="absolute right-2 top-2 flex gap-1">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* File Upload Button */}
              <Button
                onClick={triggerFileUpload}
                disabled={isLoading}
                className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-blue-200"
                title="Upload PDF or Word document"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              {/* Microphone Button */}
              <MicrophoneButton
                onTranscript={handleSttTranscript}
                disabled={isLoading}
                apiKey={process.env.NEXT_PUBLIC_REVERIE_API_KEY || ""}
                appId={process.env.NEXT_PUBLIC_REVERIE_APP_ID || ""}
                language={selectedLanguage}
                className="h-8 w-8"
                showLanguageSelector={false}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white self-end flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 mt-2 overflow-hidden">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInputValue("Improve this document")}
            disabled={isLoading || !documentContent.trim()}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-shrink-0"
          >
            Improve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInputValue("Fix grammar and spelling")}
            disabled={isLoading || !documentContent.trim()}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-shrink-0"
          >
            Fix Grammar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInputValue("Make it more concise")}
            disabled={isLoading || !documentContent.trim()}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-shrink-0"
          >
            Shorten
          </Button>
        </div>
        
        <p className="text-xs text-slate-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
