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

// Fetch questions for a specific subunit
export const getSubunitQuestions = async (subunitId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/quiz/subunit/${subunitId}/questions`)
    return response.data
  } catch (error) {
    console.error('Error fetching subunit questions:', error)
    throw error
  }
}

// Fetch a specific question by its ID
export const getQuestionById = async (questionId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/quiz/question/${questionId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching question:', error)
    throw error
  }
}
