interface TrueFalseQuestionProps {
  answer: string
  onAnswerChange: (answer: string) => void
}

export default function TrueFalseQuestion({ answer, onAnswerChange }: TrueFalseQuestionProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors">
        <input
          type="radio"
          name="true-false"
          value="True"
          checked={answer === 'True'}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <span className="text-[14px] text-gray-700">True</span>
      </label>
      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors">
        <input
          type="radio"
          name="true-false"
          value="False"
          checked={answer === 'False'}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <span className="text-[14px] text-gray-700">False</span>
      </label>
    </div>
  )
}
