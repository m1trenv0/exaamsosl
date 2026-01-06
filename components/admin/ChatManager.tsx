'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from '@/lib/schemas'
import { format } from 'date-fns'

export default function ChatManager() {
  const [exam, setExam] = useState<any>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadChat()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChat = async () => {
    try {
      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .single()

      if (examData) {
        setExam(examData)

        const { data: messagesData } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('exam_id', examData.id)
          .order('created_at', { ascending: true })

        if (messagesData) {
          setMessages(messagesData as ChatMessage[])
        }

        // Subscribe to new messages
        const channel = supabase
          .channel('admin_chat')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `exam_id=eq.${examData.id}`,
            },
            (payload) => {
              setMessages(prev => [...prev, payload.new as ChatMessage])
            }
          )
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exam || !newMessage.trim() || sending) return

    setSending(true)
    try {
      await supabase.from('chat_messages').insert({
        exam_id: exam.id,
        sender: 'admin',
        message: newMessage.trim(),
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="h-[calc(100vh-300px)]">
      <CardHeader>
        <CardTitle>Chat with Participant</CardTitle>
        <CardDescription>
          Real-time communication with the exam participant
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-100px)]">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Wait for the participant to reach the chat question.
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.sender === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      {msg.sender === 'admin' ? 'You' : 'Participant'}
                    </span>
                    <span className={`text-xs ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.created_at && format(new Date(msg.created_at), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
          />
          <Button type="submit" disabled={!newMessage.trim() || sending}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
