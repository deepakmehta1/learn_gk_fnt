// src/api.ts
import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

export const getBooks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/books`)
    return response.data
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  }
}

export const getBookDetails = async (bookId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/books/book/${bookId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching book details:', error)
    throw error
  }
}

const BEARER_TOKEN = 'your-hardcoded-bearer-token-here'

// Fetch questions for a specific subunit
export const getSubunitQuestions = async (subunitId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/quiz/subunit/${subunitId}/questions`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching subunit questions:', error)
    throw error
  }
}

// Fetch a specific question by its ID
export const getQuestionById = async (questionId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/quiz/question/${questionId}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching question:', error)
    throw error
  }
}

// Submit the answer for the given question
export const submitQuestionAnswer = async (questionId: number, choiceId: number) => {
  const BEARER_TOKEN = 'your-hardcoded-bearer-token-here'

  try {
    const response = await axios.post(
      `${BASE_URL}/quiz/question/${questionId}/submit`,
      { choice_id: choiceId },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      },
    )
    return response.data // Response should include { correct: boolean, message: string }
  } catch (error) {
    console.error('Error submitting question answer:', error)
    throw error
  }
}

// Fetch the user's progress for a specific book
export const getUserProgress = async (bookId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/progress?type=book&type_id=${bookId}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user progress:', error)
    throw error
  }
}
