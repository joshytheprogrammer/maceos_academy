import { ID, Query } from 'appwrite'
import { databases } from '~/utils/appwrite'

const DB_ID = 'academia_db'
const EXAMS_COLLECTION = 'exams'
const ATTEMPTS_COLLECTION = 'exam_attempts'

export const useExam = () => {
  // State
  const exams = ref([])
  const currentExam = ref(null)
  const attempts = ref([])
  const currentAttempt = ref(null)
  const loading = ref(false)
  const error = ref('')

  // ==========================================
  // EXAM CRUD Operations (Admin)
  // ==========================================
  
  /**
   * Fetch all exams (Admin)
   */
  const fetchAllExams = async () => {
    loading.value = true
    error.value = ''
    try {
      const response = await databases.listDocuments(
        DB_ID,
        EXAMS_COLLECTION,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      )
      exams.value = response.documents.map(doc => ({
        ...doc,
        questions: JSON.parse(doc.questions || '[]')
      }))
      return exams.value
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to fetch exams:', e)
      return []
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Fetch published exams for students
   */
  const fetchPublishedExams = async () => {
    loading.value = true
    error.value = ''
    try {
      const now = new Date().toISOString()
      const response = await databases.listDocuments(
        DB_ID,
        EXAMS_COLLECTION,
        [
          Query.equal('isPublished', true),
          Query.orderAsc('week'),
          Query.limit(100)
        ]
      )
      exams.value = response.documents.map(doc => ({
        ...doc,
        questions: JSON.parse(doc.questions || '[]')
      }))
      return exams.value
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to fetch published exams:', e)
      return []
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Get a single exam by ID
   */
  const getExam = async (examId) => {
    loading.value = true
    error.value = ''
    try {
      const doc = await databases.getDocument(DB_ID, EXAMS_COLLECTION, examId)
      currentExam.value = {
        ...doc,
        questions: JSON.parse(doc.questions || '[]')
      }
      return currentExam.value
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to get exam:', e)
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Create a new exam (Admin)
   */
  const createExam = async (examData) => {
    loading.value = true
    error.value = ''
    try {
      const doc = await databases.createDocument(
        DB_ID,
        EXAMS_COLLECTION,
        ID.unique(),
        {
          ...examData,
          questions: JSON.stringify(examData.questions || [])
        }
      )
      const newExam = {
        ...doc,
        questions: JSON.parse(doc.questions || '[]')
      }
      exams.value.unshift(newExam)
      return newExam
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to create exam:', e)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Update an exam (Admin)
   */
  const updateExam = async (examId, examData) => {
    loading.value = true
    error.value = ''
    try {
      const updatePayload = { ...examData }
      if (examData.questions) {
        updatePayload.questions = JSON.stringify(examData.questions)
      }
      
      const doc = await databases.updateDocument(
        DB_ID,
        EXAMS_COLLECTION,
        examId,
        updatePayload
      )
      
      const updatedExam = {
        ...doc,
        questions: JSON.parse(doc.questions || '[]')
      }
      
      const index = exams.value.findIndex(e => e.$id === examId)
      if (index !== -1) {
        exams.value[index] = updatedExam
      }
      
      return updatedExam
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to update exam:', e)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Delete an exam (Admin)
   */
  const deleteExam = async (examId) => {
    loading.value = true
    error.value = ''
    try {
      await databases.deleteDocument(DB_ID, EXAMS_COLLECTION, examId)
      exams.value = exams.value.filter(e => e.$id !== examId)
      return true
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to delete exam:', e)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  // ==========================================
  // EXAM ATTEMPT Operations (Student)
  // ==========================================

  /**
   * Get user's attempts for a specific exam
   */
  const getUserAttempts = async (examId, userId) => {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        ATTEMPTS_COLLECTION,
        [
          Query.equal('examId', examId),
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      )
      return response.documents.map(doc => ({
        ...doc,
        answers: JSON.parse(doc.answers || '{}')
      }))
    }
    catch (e) {
      console.error('Failed to get user attempts:', e)
      return []
    }
  }

  /**
   * Get all attempts for an exam (Admin)
   */
  const getExamAttempts = async (examId) => {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        ATTEMPTS_COLLECTION,
        [
          Query.equal('examId', examId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      )
      return response.documents.map(doc => ({
        ...doc,
        answers: JSON.parse(doc.answers || '{}')
      }))
    }
    catch (e) {
      console.error('Failed to get exam attempts:', e)
      return []
    }
  }

  /**
   * Get all attempts by a user (Admin/Student)
   */
  const getAllUserAttempts = async (userId) => {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        ATTEMPTS_COLLECTION,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      )
      attempts.value = response.documents.map(doc => ({
        ...doc,
        answers: JSON.parse(doc.answers || '{}')
      }))
      return attempts.value
    }
    catch (e) {
      console.error('Failed to get user attempts:', e)
      return []
    }
  }

  /**
   * Start an exam attempt
   */
  const startExamAttempt = async (examId, userId, totalQuestions) => {
    loading.value = true
    error.value = ''
    try {
      const doc = await databases.createDocument(
        DB_ID,
        ATTEMPTS_COLLECTION,
        ID.unique(),
        {
          examId,
          userId,
          answers: JSON.stringify({}),
          totalQuestions,
          startedAt: new Date().toISOString(),
          isSubmitted: false
        },
        // Set document-level permissions for the user
        [
          `read("user:${userId}")`,
          `update("user:${userId}")`,
          `read("label:admin")`
        ]
      )
      
      currentAttempt.value = {
        ...doc,
        answers: {}
      }
      
      return currentAttempt.value
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to start exam attempt:', e)
      throw e
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Save answers (auto-save during exam)
   */
  const saveAnswers = async (attemptId, answers) => {
    try {
      await databases.updateDocument(
        DB_ID,
        ATTEMPTS_COLLECTION,
        attemptId,
        {
          answers: JSON.stringify(answers)
        }
      )
      if (currentAttempt.value && currentAttempt.value.$id === attemptId) {
        currentAttempt.value.answers = answers
      }
      return true
    }
    catch (e) {
      console.error('Failed to save answers:', e)
      return false
    }
  }

  /**
   * Get an attempt by ID
   */
  const getAttempt = async (attemptId) => {
    try {
      const doc = await databases.getDocument(DB_ID, ATTEMPTS_COLLECTION, attemptId)
      currentAttempt.value = {
        ...doc,
        answers: JSON.parse(doc.answers || '{}')
      }
      return currentAttempt.value
    }
    catch (e) {
      console.error('Failed to get attempt:', e)
      return null
    }
  }

  // ==========================================
  // Utility Functions
  // ==========================================

  /**
   * Check if exam is currently available
   */
  const isExamAvailable = (exam) => {
    if (!exam) return false
    const now = new Date()
    const start = new Date(exam.startDate)
    const end = new Date(exam.endDate)
    return now >= start && now <= end && exam.isPublished
  }

  /**
   * Check if exam is upcoming
   */
  const isExamUpcoming = (exam) => {
    if (!exam) return false
    const now = new Date()
    const start = new Date(exam.startDate)
    return now < start && exam.isPublished
  }

  /**
   * Check if exam has ended
   */
  const isExamEnded = (exam) => {
    if (!exam) return false
    const now = new Date()
    const end = new Date(exam.endDate)
    return now > end
  }

  /**
   * Format time remaining
   */
  const formatTimeRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Calculate percentage score
   */
  const calculateScore = (correctCount, totalCount) => {
    if (totalCount === 0) return 0
    return Math.round((correctCount / totalCount) * 100)
  }

  return {
    // State
    exams,
    currentExam,
    attempts,
    currentAttempt,
    loading,
    error,
    
    // Admin Operations
    fetchAllExams,
    createExam,
    updateExam,
    deleteExam,
    getExamAttempts,
    
    // Student Operations
    fetchPublishedExams,
    getExam,
    getUserAttempts,
    getAllUserAttempts,
    startExamAttempt,
    saveAnswers,
    getAttempt,
    
    // Utilities
    isExamAvailable,
    isExamUpcoming,
    isExamEnded,
    formatTimeRemaining,
    calculateScore
  }
}
