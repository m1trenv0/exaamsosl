'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import QuestionsManager from './QuestionsManager'
import ChatManager from './ChatManager'
import ExamSettings from './ExamSettings'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Exam Admin Panel</h1>
              <p className="text-sm text-gray-500">Manage exam, questions, and live chat</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Chat - Prominent Position */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💬</span>
              <h2 className="text-xl font-bold text-gray-900">Live Chat with Student</h2>
            </div>
            <ChatManager />
          </div>

          {/* Questions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Questions</h2>
            <QuestionsManager />
          </div>

          {/* Settings */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
            <ExamSettings />
          </div>
        </div>
      </div>
    </div>
  )
}
