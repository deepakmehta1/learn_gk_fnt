// src/api.ts
import axios from 'axios'

const BASE_URL = 'http://localhost:8000/books'

export const getBooks = async () => {
  try {
    const response = await axios.get(BASE_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  }
}

export const getBookDetails = async (bookId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/book/${bookId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching book details:', error)
    throw error
  }
}
