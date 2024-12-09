// src/types/quizTypes.ts

// Define the structure of a single Option
export interface Option {
  id: number
  text_en: string // English version of the option text
  text_hi: string // Hindi version of the option text
}

// Define the structure of a single Question
export interface Question {
  id: number
  text_en: string // English version of the question text
  text_hi: string // Hindi version of the question text
  active: boolean // Whether the question is active
  reported: boolean // Whether the question has been reported
  choices: Option[] // Array of choices (options) for the question
}
