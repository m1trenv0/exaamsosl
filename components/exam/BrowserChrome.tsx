'use client'

import { useState, ReactNode } from 'react'

interface Tab {
  id: number
  title: string
  isMain: boolean
}

interface BrowserChromeProps {
  title: string
  children: ReactNode
}

export default function BrowserChrome({ title, children }: BrowserChromeProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title, isMain: true }
  ])
  const [activeTabId, setActiveTabId] = useState(1)
  const [nextId, setNextId] = useState(2)

  const addTab = () => {
    const newTab: Tab = {
      id: nextId,
      title: 'About new',
      isMain: false
    }
    setTabs([...tabs, newTab])
    setActiveTabId(nextId)
    setNextId(nextId + 1)
  }

  const closeTab = (tabId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const tab = tabs.find(t => t.id === tabId)
    if (tab?.isMain) return // Не закрываем главную вкладку
    
    const newTabs = tabs.filter(t => t.id !== tabId)
    setTabs(newTabs)
    
    // Если закрываем активную вкладку, переключаемся на другую
    if (activeTabId === tabId) {
      const index = tabs.findIndex(t => t.id === tabId)
      const nextTab = newTabs[index] || newTabs[index - 1]
      if (nextTab) setActiveTabId(nextTab.id)
    }
  }

  const activeTab = tabs.find(t => t.id === activeTabId)
  const isBookmarksPage = activeTab && !activeTab.isMain

  return (
    <>
      {/* Tabs */}
      <div className="browser-tabs">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`browser-tab ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span className="text-[15px] font-normal text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis flex-1">
              {tab.title}
            </span>
            <button
              onClick={(e) => closeTab(tab.id, e)}
              className={`ml-2 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-300 transition-colors ${tab.isMain ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              title={tab.isMain ? "Cannot close main tab" : "Close tab"}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="ml-1 w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded transition-colors"
          title="New tab"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Address Bar */}
      <div className="browser-addressbar">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <svg className="w-[16px] h-[16px] text-gray-600 cursor-pointer hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <div className="flex-1 flex items-center bg-white border border-gray-300 rounded h-[32px] px-3 shadow-sm">
          <svg className="w-[13px] h-[13px] text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[15px] text-gray-600">
            {isBookmarksPage ? 'canvas://bookmarks' : 'https://canvas.kdg.be'}
          </span>
        </div>
      </div>

      {/* Content */}
      {isBookmarksPage ? (
        <div className="flex-1 bg-white flex flex-col items-center justify-start pt-20 overflow-auto">
          <h2 className="text-3xl font-light text-gray-700 mb-4">Bookmarks</h2>
          <p className="text-gray-500">No bookmarks</p>
        </div>
      ) : (
        children
      )}
    </>
  )
}
