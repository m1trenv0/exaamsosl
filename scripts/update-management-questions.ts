/**
 * Update management questions:
 * - First 10 questions: Convert to multiple_choice
 * - After 10: Mix of multiple_choice, multiple_select, true_false, categorization, essay_rich
 */

import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const updatedQuestions = [
  // Question 0 - Multiple Choice
  {
    order_index: 0,
    question_text: "What is the Board of Directors?",
    question_type: "multiple_choice",
    options: {
      options: [
        "A group of elected individuals who oversee the management and strategic direction of a company",
        "A team of employees responsible for daily operations",
        "External auditors who review financial statements",
        "Government officials who regulate business activities"
      ],
      correct: 0
    }
  },
  // Question 1 - Multiple Choice
  {
    order_index: 1,
    question_text: "Which of the following are examples of internal stakeholders?",
    question_type: "multiple_choice",
    options: {
      options: [
        "Employees and managers",
        "Customers and suppliers",
        "Government and competitors",
        "Banks and creditors"
      ],
      correct: 0
    }
  },
  // Question 2 - Multiple Choice
  {
    order_index: 2,
    question_text: "Which of the following is an example of a financial transaction?",
    question_type: "multiple_choice",
    options: {
      options: [
        "Purchasing inventory with cash",
        "Having a business meeting",
        "Planning next year's budget",
        "Discussing market trends"
      ],
      correct: 0
    }
  },
  // Question 3 - Multiple Choice
  {
    order_index: 3,
    question_text: "What are the two main sides of a balance sheet?",
    question_type: "multiple_choice",
    options: {
      options: [
        "Assets and Liabilities + Equity",
        "Revenue and Expenses",
        "Debits and Credits",
        "Income and Cash Flow"
      ],
      correct: 0
    }
  },
  // Question 4 - Multiple Choice
  {
    order_index: 4,
    question_text: "What does CAPEX stand for?",
    question_type: "multiple_choice",
    options: {
      options: [
        "Capital Expenditure - long-term investments in assets",
        "Current Expenses - daily operational costs",
        "Cash Exchange - money transfers",
        "Corporate Expansion - business growth"
      ],
      correct: 0
    }
  },
  // Question 5 - Multiple Choice
  {
    order_index: 5,
    question_text: "Who pays social security contributions in Belgium?",
    question_type: "multiple_choice",
    options: {
      options: [
        "Both employer and employee",
        "Only the employer",
        "Only the employee",
        "The government"
      ],
      correct: 0
    }
  },
  // Question 6 - Multiple Choice (calculation)
  {
    order_index: 6,
    question_text: "Mike earns €3000 gross per month. With employee social security of 13.07% and withholding tax of 30%, what is approximately his net salary?",
    question_type: "multiple_choice",
    options: {
      options: [
        "€1,826",
        "€2,100",
        "€2,500",
        "€2,800"
      ],
      correct: 0
    }
  },
  // Question 7 - Multiple Choice
  {
    order_index: 7,
    question_text: "If Syrine earns €1700 net with 13.07% social security and 27% tax, what is her approximate gross salary?",
    question_type: "multiple_choice",
    options: {
      options: [
        "€2,700",
        "€2,000",
        "€2,300",
        "€3,000"
      ],
      correct: 0
    }
  },
  // Question 8 - Multiple Choice
  {
    order_index: 8,
    question_text: "What is depreciation?",
    question_type: "multiple_choice",
    options: {
      options: [
        "The systematic allocation of the cost of a tangible asset over its useful life",
        "A cash payment for using equipment",
        "The increase in value of an asset over time",
        "A tax payment to the government"
      ],
      correct: 0
    }
  },
  // Question 9 - Multiple Choice
  {
    order_index: 9,
    question_text: "What is the basic accounting equation?",
    question_type: "multiple_choice",
    options: {
      options: [
        "Assets = Liabilities + Equity",
        "Revenue - Expenses = Profit",
        "Debits = Credits",
        "Income = Cash Flow"
      ],
      correct: 0
    }
  },
  // Question 10 - Keep as Multiple Select
  {
    order_index: 10,
    question_text: "Which of the following ratios measures liquidity? Select all that apply.",
    question_type: "multiple_select",
    options: {
      correct: [0, 2, 4],
      options: [
        "Current Ratio",
        "Debt Ratio",
        "Quick Ratio",
        "ROE (Return on Equity)",
        "Cash Ratio",
        "Solvency Degree"
      ]
    }
  },
  // Question 11 - Keep as Multiple Choice
  {
    order_index: 11,
    question_text: "Which formula correctly calculates the Current Ratio?",
    question_type: "multiple_choice",
    options: {
      correct: 0,
      options: [
        "Current assets / Short-term liabilities",
        "Equity / Total assets",
        "Net profit / Equity",
        "Total debts / Total assets"
      ]
    }
  },
  // Question 12 - Categorization
  {
    order_index: 12,
    question_text: "Categorize the following items into Balance Sheet or Income Statement:",
    question_type: "categorization",
    options: {
      categories: [
        { name: "Balance Sheet", items: ["Assets", "Liabilities", "Equity", "Cash"] },
        { name: "Income Statement", items: ["Revenue", "Expenses", "Net Profit"] }
      ],
      possibleAnswers: ["Assets", "Revenue", "Liabilities", "Expenses", "Equity", "Net Profit", "Cash", "Dividends"]
    }
  },
  // Question 13 - True/False
  {
    order_index: 13,
    question_text: "Depreciation is a cash expense.",
    question_type: "true_false",
    options: {
      correct: 1
    }
  },
  // Question 14 - Essay Rich
  {
    order_index: 14,
    question_text: "Explain the double-entry bookkeeping system and why it's important for maintaining accurate financial records.",
    question_type: "essay_rich",
    options: {
      wordLimit: { min: 100, max: 200 }
    }
  },
  // Question 15 - True/False
  {
    order_index: 15,
    question_text: "The income statement shows the financial position at a specific moment in time.",
    question_type: "true_false",
    options: {
      correct: 1
    }
  },
  // Question 16 - Multiple Select
  {
    order_index: 16,
    question_text: "Which of the following are types of financial statements? Select all that apply.",
    question_type: "multiple_select",
    options: {
      correct: [0, 1, 2],
      options: [
        "Balance Sheet",
        "Income Statement",
        "Cash Flow Statement",
        "Marketing Plan",
        "Business Model Canvas"
      ]
    }
  },
  // Question 17 - Categorization
  {
    order_index: 17,
    question_text: "Categorize the following as CAPEX or OPEX:",
    question_type: "categorization",
    options: {
      categories: [
        { name: "CAPEX", items: ["Building purchase", "Machinery", "Computer servers"] },
        { name: "OPEX", items: ["Monthly rent", "Salaries", "Office supplies"] }
      ],
      possibleAnswers: ["Building purchase", "Monthly rent", "Machinery", "Salaries", "Computer servers", "Office supplies", "Marketing campaign"]
    }
  },
  // Question 18 - Multiple Choice
  {
    order_index: 18,
    question_text: "What is a trial balance used for?",
    question_type: "multiple_choice",
    options: {
      options: [
        "To verify that total debits equal total credits in the accounting system",
        "To calculate employee salaries",
        "To determine market share",
        "To assess customer satisfaction"
      ],
      correct: 0
    }
  },
  // Question 19 - Essay Rich
  {
    order_index: 19,
    question_text: "Compare and contrast the balance sheet and the income statement. Explain what information each provides and why both are essential for understanding a company's financial health.",
    question_type: "essay_rich",
    options: {
      wordLimit: { min: 150, max: 250 }
    }
  }
]

async function updateQuestions() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  })

  try {
    await client.connect()
    console.log('✓ Connected to database\n')

    for (const question of updatedQuestions) {
      const result = await client.query(
        `UPDATE questions 
         SET question_text = $1, 
             question_type = $2, 
             options = $3
         WHERE order_index = $4
         RETURNING order_index, question_type`,
        [
          question.question_text,
          question.question_type,
          JSON.stringify(question.options),
          question.order_index
        ]
      )

      if (result.rows.length > 0) {
        console.log(`✓ Updated Q${question.order_index}: ${question.question_type}`)
      } else {
        console.log(`✗ Failed to update Q${question.order_index}`)
      }
    }

    console.log('\n✅ All questions updated successfully!')
    console.log('\nSummary:')
    console.log('- Questions 0-9: multiple_choice')
    console.log('- Question 10: multiple_select')
    console.log('- Question 11: multiple_choice')
    console.log('- Question 12: categorization')
    console.log('- Question 13: true_false')
    console.log('- Question 14: essay_rich')
    console.log('- Question 15: true_false')
    console.log('- Question 16: multiple_select')
    console.log('- Question 17: categorization')
    console.log('- Question 18: multiple_choice')
    console.log('- Question 19: essay_rich')

  } catch (error) {
    console.error('✗ Error:', error)
  } finally {
    await client.end()
  }
}

updateQuestions()
