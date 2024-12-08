// src/api.ts
import axios from 'axios'

const API_URL = 'http://localhost:8000/books'

export const getBooks = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  }
}
