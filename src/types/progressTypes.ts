// src/types/progressTypes.ts

export interface RecentQuestionDetail {
  unit_id: number
  sub_unit_id: number
  question_id: number
  status: string // "submitted" or other possible statuses
}

export interface UserProgress {
  total_questions: number
  total_questions_attempted: number
  total_questions_correct: number
  accuracy: number
  recent_question_details: RecentQuestionDetail[]
}
