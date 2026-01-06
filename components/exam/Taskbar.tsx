'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  examTitle: string
}

export default function Taskbar({ examTitle }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showExitModal, setShowExitModal] = useState(false)
  const [showWifiMenu, setShowWifiMenu] = useState(false)
  const [showVolumeMenu, setShowVolumeMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [volume, setVolume] = useState(70)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const handleExit = () => {
    // Exit logic here
    window.close()
  }

  const openNewTab = () => {
    window.open(window.location.href, '_blank')
  }

  return (
    <>
      <div className="windows-taskbar">
        <div className="flex items-center gap-1">
          <div className="w-[35px] h-[35px] flex items-center justify-center">
            <Image 
              src="/landing/logo.png" 
              alt="Logo" 
              width={28} 
              height={28}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-semibold text-[15px] leading-tight text-white">
              {examTitle}
            </span>
            <span className="text-[12.5px] text-gray-300 leading-tight">
              Chyada Andriei · STUD.183622
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowLanguageMenu(!showLanguageMenu)
                setShowWifiMenu(false)
                setShowVolumeMenu(false)
              }}
              className="font-semibold text-[14px] hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              EN
            </button>
            {showLanguageMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white text-black rounded-lg shadow-2xl p-3 min-w-[200px]">
                <div className="space-y-1">
                  <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer font-semibold bg-blue-50">
                    EN - English
                  </div>
                  <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                    RU - Русский
                  </div>
                  <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                    UA - Українська
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Battery Icon */}
          <div className="flex items-center justify-center w-[22px] h-[22px]">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </div>

          {/* Volume Control */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowVolumeMenu(!showVolumeMenu)
                setShowWifiMenu(false)
                setShowLanguageMenu(false)
              }}
              className="flex items-center justify-center w-[22px] h-[22px] hover:bg-white/10 rounded p-1 transition-colors cursor-pointer"
              title="Volume"
            >
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </button>
            {showVolumeMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white text-black rounded-lg shadow-2xl p-4 w-[250px]">
                <div className="font-semibold mb-3">Volume</div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                  </svg>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-sm font-semibold w-8 text-right">{volume}</span>
                </div>
              </div>
            )}
          </div>

          {/* WiFi Menu */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowWifiMenu(!showWifiMenu)
                setShowVolumeMenu(false)
                setShowLanguageMenu(false)
              }}
              className="flex items-center justify-center w-[22px] h-[22px] hover:bg-white/10 rounded p-1 transition-colors cursor-pointer"
              title="WiFi"
            >
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            {showWifiMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white text-black rounded-lg shadow-2xl p-4 min-w-[280px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">wifi-kmr13</span>
                    </div>
                    <span className="text-blue-600 font-semibold text-sm">Connected</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Connection stable</span>
                  </div>
                  <button className="w-full mt-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex flex-col items-end justify-center leading-tight ml-2 mr-2">
            <div className="text-[12px] font-semibold whitespace-nowrap">
              {formatDate(currentTime)}
            </div>
            <div className="text-[12px] font-semibold whitespace-nowrap">
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Exit Button */}
          <button 
            onClick={() => setShowExitModal(true)}
            className="bg-[#e85e13] text-white h-[34px] px-[18px] rounded-md font-semibold text-[14px] flex items-center gap-2 hover:bg-[#d44d08] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Exit
          </button>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Exit application</h2>
            <p className="text-gray-700 mb-6">
              Make sure to finalize your session before closing the application.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleExit}
                className="px-6 py-2 bg-[#e85e13] text-white rounded-md hover:bg-[#d44d08] transition-colors font-semibold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(showWifiMenu || showVolumeMenu || showLanguageMenu) && (
        <div 
          className="fixed inset-0 z-[45]" 
          onClick={() => {
            setShowWifiMenu(false)
            setShowVolumeMenu(false)
            setShowLanguageMenu(false)
          }}
        />
      )}
    </>
  )
}
