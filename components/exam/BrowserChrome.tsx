export default function BrowserChrome({ title }: { title: string }) {
  return (
    <>
      <div className="browser-tabs">
        <div className="browser-tab">
          <span className="text-[15px] font-normal text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </span>
        </div>
      </div>

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
          <span className="text-[15px] text-gray-600">https://canvas.kdg.be</span>
        </div>
      </div>
    </>
  )
}
