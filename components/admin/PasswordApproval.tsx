'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PasswordAttempt {
  id: string
  exam_id: string
  participant_name: string
  password_entered: string
  status: 'pending' | 'approved' | 'declined'
  created_at: string
  reviewed_at?: string
  reviewed_by?: string
  exams?: {
    title: string
  }
}

export default function PasswordApproval() {
  const [attempts, setAttempts] = useState<PasswordAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadAttempts()
    // Poll every 5 seconds for new attempts
    const interval = setInterval(loadAttempts, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadAttempts = async () => {
    try {
      const response = await fetch('/api/admin/password-attempts')
      const data = await response.json()
      if (data.attempts) {
        setAttempts(data.attempts)
      }
    } catch (error) {
      console.error('Error loading attempts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (attemptId: string, status: 'approved' | 'declined') => {
    setProcessingId(attemptId)
    try {
      const response = await fetch('/api/admin/password-attempts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          status,
          reviewedBy: 'Admin',
        }),
      })

      if (response.ok) {
        await loadAttempts()
      }
    } catch (error) {
      console.error('Error reviewing attempt:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const pendingAttempts = attempts.filter(a => a.status === 'pending')
  const reviewedAttempts = attempts.filter(a => a.status !== 'pending')

  if (loading) {
    return <div className="text-center py-8">Loading password attempts...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Password Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingAttempts.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending password attempts</p>
          ) : (
            <div className="space-y-3">
              {pendingAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="border border-gray-200 rounded-lg p-4 bg-yellow-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {attempt.participant_name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Exam: {attempt.exams?.title || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Password: <code className="bg-white px-2 py-0.5 rounded border">{attempt.password_entered}</code>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(attempt.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReview(attempt.id, 'approved')}
                        disabled={processingId === attempt.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        onClick={() => handleReview(attempt.id, 'declined')}
                        disabled={processingId === attempt.id}
                        variant="destructive"
                        size="sm"
                      >
                        ✕ Decline
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviewed Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewedAttempts.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviewed attempts yet</p>
          ) : (
            <div className="space-y-2">
              {reviewedAttempts.slice(0, 10).map((attempt) => (
                <div
                  key={attempt.id}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {attempt.participant_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {attempt.exams?.title || 'Unknown'} · {new Date(attempt.created_at).toLocaleString()}
                      </div>
                    </div>
                    <Badge
                      variant={attempt.status === 'approved' ? 'default' : 'destructive'}
                    >
                      {attempt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
