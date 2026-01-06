'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/exam')
      .then(r => r.json())
      .then(d => {
        setData(d)
        console.log('Loaded data:', d)
      })
  }, [])

  if (!data) return <div>Loading...</div>

  const q10 = data.questions?.find((q: any) => q.order_index === 10)
  const q11 = data.questions?.find((q: any) => q.order_index === 11)
  const q13 = data.questions?.find((q: any) => q.order_index === 13)

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Questions</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Question 10 (should be multiple_select)</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(q10, null, 2)}
        </pre>
        <div className="mt-2">
          <strong>Type:</strong> {q10?.question_type}<br/>
          <strong>Has options:</strong> {String(!!q10?.options)}<br/>
          <strong>Options type:</strong> {typeof q10?.options}<br/>
          <strong>Has options.options:</strong> {String(!!q10?.options?.options)}<br/>
          <strong>Is options.options array:</strong> {String(Array.isArray(q10?.options?.options))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Question 11 (should be multiple_choice)</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(q11, null, 2)}
        </pre>
        <div className="mt-2">
          <strong>Type:</strong> {q11?.question_type}<br/>
          <strong>Has options:</strong> {String(!!q11?.options)}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Question 13 (should be true_false)</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(q13, null, 2)}
        </pre>
        <div className="mt-2">
          <strong>Type:</strong> {q13?.question_type}<br/>
          <strong>Has options:</strong> {String(!!q13?.options)}
        </div>
      </div>
    </div>
  )
}
