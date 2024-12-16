// Define the type for Subunit
export interface Subunit {
  id: number
  title_en: string
  title_hi: string
  question_count: number
  is_preview: boolean
}

// Define the type for Unit
export interface Unit {
  id: number
  title_en: string
  title_hi: string
  question_count: number
  subunits: Subunit[]
}

// Define the type for Book
export interface Book {
  id: number
  title_en: string
  title_hi: string
  units: Unit[]
}
