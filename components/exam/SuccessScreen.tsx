interface Props {
  onReturn?: () => void
}

export default function SuccessScreen({ onReturn }: Props) {
  return (
    <div className="p-6">
      {/* Top Action Bar */}
      <div className="flex justify-end items-center mb-6">
        <button 
          onClick={onReturn}
          className="bg-white border border-gray-300 px-4 py-1.5 rounded text-[13px] text-gray-600 font-medium hover:bg-gray-50"
        >
          Return
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Results</h1>
        
        {/* Success Message */}
        <div className="bg-[#D5F5E8] border border-[#0B874B] rounded-md p-4 mb-6 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg 
              className="w-5 h-5 text-[#0B874B]" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[#0B874B] text-[14px] font-medium">
              Success! Your submission was successful.
            </p>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-gray-50 border border-gray-300 rounded-md p-4 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg 
              className="w-5 h-5 text-gray-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-gray-700 text-[14px]">
              Results are not displayed as per instructor settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
