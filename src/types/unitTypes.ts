// src/types/unitTypes.ts

// Define the type for Subunit
export interface Subunit {
  id: number
  title_en: string
  title_hi: string
}

// Define the type for Unit
export interface Unit {
  id: number
  title_en: string
  title_hi: string
  subunits: Subunit[]
}
