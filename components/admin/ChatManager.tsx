'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ChatMessage } from '@/lib/schemas'
import { format } from 'date-fns'

export default function ChatManager() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChat()
    const interval = setInterval(loadChat, 1500) // Poll every 1.5s for admin
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const loadChat = async () => {
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()
      
      if (data.messages) {
        setMessages(data.messages)
        
        // Count unread messages from participant
        const unread = data.messages.filter(
          (msg: ChatMessage) => msg.sender === 'participant' && !msg.is_read
        ).length
        setUnreadCount(unread)
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          sender: 'admin',
        }),
      })

      setNewMessage('')
      await loadChat()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Chat
          {unreadCount > 0 && (
            <Badge variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <ScrollArea ref={scrollAreaRef} className="h-[500px] border-2 rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                💬 No messages yet. Student will see chat on question 4.
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                      msg.sender === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border-2 border-green-300 text-gray-900'
                    }`}
                  >
                    {msg.sender === 'participant' && (
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-bold text-green-700">Student</span>
                        {!msg.is_read && (
                          <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">NEW</span>
                        )}
                      </div>
                    )}
                    {msg.image_data && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={msg.image_data}
                        alt="Shared"
                        className="rounded mb-2 max-w-full h-auto cursor-pointer hover:opacity-90"
                        style={{ maxHeight: '300px' }}
                        onClick={() => window.open(msg.image_data || '', '_blank')}
                      />
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {format(new Date(msg.created_at || new Date()), 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()} size="lg">
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
