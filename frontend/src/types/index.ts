export interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  xp_points: number
  level: number
  streak_days: number
  created_at: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface Course {
  id: number
  title: string
  description: string | null
  thumbnail_url: string | null
  category: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  is_published: boolean
  created_at: string
  lessons: Lesson[]
}

export interface Lesson {
  id: number
  course_id: number
  title: string
  description: string | null
  youtube_url: string
  notes: string | null
  order_index: number
  xp_reward: number
  created_at: string
}

export interface Quiz {
  id: number
  lesson_id: number
  title: string
  pass_score: number
  xp_bonus: number
  created_at: string
  questions: Question[]
}

export interface Question {
  id: number
  quiz_id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

export interface QuizResult {
  quiz_id: number
  score: number
  passed: boolean
  xp_earned: number
  correct_count: number
  total_questions: number
}

export interface MyProgress {
  completed_lessons: number
  total_xp: number
  level: number
  streak_days: number
}

export interface LessonProgress {
  lesson_id: number
  is_completed: boolean
  quiz_passed: boolean
  xp_earned: number
  completed_at: string | null
}

export interface LessonCompleteResponse {
  message: string
  xp_earned: number
  total_xp: number
  level: number
  streak_days: number
}
