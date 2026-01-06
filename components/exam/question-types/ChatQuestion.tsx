'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

interface Message {
  id: string
  message: string
  sender: 'admin' | 'participant'
  created_at: string
  is_read: boolean
}

interface ChatQuestionProps {
  questionText?: string | null
  volume?: number
}

export default function ChatQuestion({ questionText, volume = 70 }: ChatQuestionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 2000) // Poll every 2 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
        
        // Mark admin messages as read
        const unreadAdminMessages = data.messages.filter(
          (msg: Message) => msg.sender === 'admin' && !msg.is_read
        )
        if (unreadAdminMessages.length > 0) {
          await fetch('/api/chat/mark-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              messageIds: unreadAdminMessages.map((msg: Message) => msg.id) 
            }),
          })
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          sender: 'participant',
        }),
      })

      setNewMessage('')
      await loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const isChatVisible = volume >= 45 && volume <= 55

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Question Section - Left Side */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-gray-700 leading-relaxed">
            {questionText ? (
              <p>{questionText}</p>
            ) : (
              <p className="text-gray-500 italic">No question text provided</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Section - Right Side with muted colors */}
      <div className="space-y-3">
        {isChatVisible && (
          <>
            <ScrollArea ref={scrollAreaRef} className="h-[350px] border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 text-sm">
                    No messages yet. Send a message if you need help!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'participant' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-2.5 text-sm ${
                          msg.sender === 'participant'
                            ? 'bg-gray-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-800 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {msg.sender === 'admin' && (
                            <span className="text-xs font-semibold text-gray-600">Instructor:</span>
                          )}
                        </div>
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === 'participant' ? 'text-gray-300' : 'text-gray-400'
                          }`}
                        >
                          {format(new Date(msg.created_at || new Date()), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 bg-white text-sm"
              />
              <Button 
                type="submit" 
                disabled={loading || !newMessage.trim()}
                className="bg-gray-600 hover:bg-gray-700 text-sm disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
