// src/types/quizTypes.ts

// Define the structure of a single Option
export interface Option {
  id: number
  option_text: string
}

// Define the structure of a single Question
export interface Question {
  id: number
  question_text: string
  options: Option[]
}
