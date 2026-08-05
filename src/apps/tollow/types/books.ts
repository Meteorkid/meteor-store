// @ts-nocheck
/* eslint-disable */
export type BookDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface TextMetrics {
  byteSize: number
  graphemeCount: number
  wordCount: number
}

export interface BookSection extends TextMetrics {
  id: string
  title: string
  path: string
  sha256: string
}

export type BookContributorRole =
  | 'author'
  | 'compiler'
  | 'editor'
  | 'translator'

export interface BookContributor {
  name: string
  role: BookContributorRole
  deathYear: number | null
  notes?: string
}

export interface RightsReview {
  status: 'public-domain'
  distribution: 'global-reviewed'
  authorDeathYear: number | null
  firstPublicationYear: number
  edition: string
  editionSourceUrl: string
  editionLicense: string
  evidenceUrls: string[]
  reviewedAt: string
  notes?: string
}

export interface BookManifest {
  id: string
  title: string
  author: string
  locale: string
  description: string
  cover: string
  difficulty: BookDifficulty
  category: string
  tags: string[]
  contributors?: BookContributor[]
  sections: BookSection[]
  totals: TextMetrics
  rights: RightsReview
}

export interface BookProgress {
  bookId: string
  sectionId: string
  segmentIndex: number
  offset: number
  updatedAt: string
}
