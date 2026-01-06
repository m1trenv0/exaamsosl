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

export default function ChatQuestion() {
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

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💬 <strong>Help Chat:</strong> Ask questions to the instructor if you need assistance
        </p>
      </div>

      <ScrollArea ref={scrollAreaRef} className="h-[400px] border rounded-lg p-4 bg-gray-50">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No messages yet. Send a message if you need help!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'participant' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'participant'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.sender === 'admin' && (
                      <span className="text-xs font-semibold text-blue-600">Instructor:</span>
                    )}
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === 'participant' ? 'text-blue-100' : 'text-gray-500'
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
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !newMessage.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  )
}
