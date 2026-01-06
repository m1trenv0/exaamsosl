interface MultipleSelectQuestionProps {
  options: string[]
  answer: string
  onAnswerChange: (answer: string) => void
}

export default function MultipleSelectQuestion({ 
  options, 
  answer, 
  onAnswerChange 
}: MultipleSelectQuestionProps) {
  const selectedIndices = answer ? answer.split(',').filter(Boolean) : []

  const handleToggle = (index: number) => {
    const indexStr = index.toString()
    let newSelected = [...selectedIndices]
    
    if (newSelected.includes(indexStr)) {
      newSelected = newSelected.filter(i => i !== indexStr)
    } else {
      newSelected.push(indexStr)
    }
    
    onAnswerChange(newSelected.join(','))
  }

  return (
    <div className="space-y-2">
      {options.map((option, idx) => (
        <label 
          key={idx} 
          className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedIndices.includes(idx.toString())}
            onChange={() => handleToggle(idx)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-[14px] text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  )
}
