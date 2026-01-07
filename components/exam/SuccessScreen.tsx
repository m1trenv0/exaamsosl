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
          className="bg-white border border-[#C7CDD1] px-4 py-1.5 rounded text-[13px] text-[#2D3B45] hover:bg-gray-50"
        >
          Return
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-[32px] leading-[38px] font-semibold text-[#2D3B45] mb-6">Results</h1>

        {/* Panel */}
        <div className="border border-[#C7CDD1] bg-[#F5F5F5]">
          <div className="p-6">
            {/* Success plaque */}
            <div className="border border-[#C7CDD1] bg-white shadow-sm flex items-stretch h-11">
              <div className="w-11 bg-[#0B874B] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6663 5L7.49967 14.1667L3.33301 10"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 flex items-center px-4">
                <div className="text-[13px] text-[#2D3B45]">
                  <span className="font-semibold">Success!</span> Your submission was successful.
                </div>
              </div>
            </div>

            {/* Info line */}
            <div className="mt-5 flex items-start gap-2 text-[13px] text-[#2D3B45]">
              <div className="mt-[2px] text-gray-500">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9 8.5a.75.75 0 000 1.5h.25V14a.75.75 0 00.75.75h.5a.75.75 0 000-1.5H10.75V9.25a.75.75 0 00-.75-.75H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>Results are not displayed as per instructor settings.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
