'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from '@/lib/schemas'
import { format } from 'date-fns'

export default function ChatManager() {
  const [exam, setExam] = useState<{ id: string; chat_question_index: number | null } | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChat()
    const interval = setInterval(loadChat, 3000) // Poll every 3s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChat = async () => {
    try {
      const response = await fetch('/api/admin/chat')
      const data = await response.json()
      
      if (data.exam && data.messages) {
        setExam(data.exam)
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  const sendMessage = async () => {
    if (!exam?.id || !newMessage.trim() || sending) return

    setSending(true)
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam.id,
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
    <Card>
      <CardHeader>
        <CardTitle>Chat with Participant</CardTitle>
        <CardDescription>
          Real-time communication (refreshes every 3 seconds)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] border rounded-md p-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No messages yet. The chat will appear in question {exam?.chat_question_index || '?'}
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
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
            disabled={sending || !exam}
          />
          <Button type="submit" disabled={sending || !newMessage.trim() || !exam}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
