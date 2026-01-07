'use client'

import { useState } from 'react'

interface Props {
  onSubmit: (name: string, password: string) => void
  isLoading?: boolean
}

export default function PasswordPrompt({ onSubmit, isLoading }: Props) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && password.trim()) {
      onSubmit(name, password)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-[10px] shadow-2xl border border-[#C7CDD1] w-full max-w-[560px] mx-6">
        <form onSubmit={handleSubmit}>
          <div className="px-8 pt-6 pb-5">
            <h2 className="text-[24px] leading-[30px] font-semibold text-[#2D3B45] text-center mb-3">
              Enter Exam Credentials
            </h2>
            <p className="text-[14px] leading-[20px] text-[#2D3B45] text-left mb-5">
              Please enter your name and exam password to begin.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[13px] font-medium text-[#2D3B45] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-[#C7CDD1] bg-white px-3 py-2 text-[14px] rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#2D3B45] mb-1.5">
                  Exam Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-[#C7CDD1] bg-white px-3 py-2 text-[14px] rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter exam password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-5">
              <button
                type="submit"
                disabled={isLoading || !name.trim() || !password.trim()}
                className="h-9 px-5 bg-[#0B874B] text-white rounded-md hover:bg-[#096B3C] transition-colors font-semibold flex items-center gap-2 text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Waiting for approval...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.6663 5L7.49967 14.1667L3.33301 10"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
