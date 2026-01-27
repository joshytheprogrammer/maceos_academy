import { Client, Databases, Query } from 'node-appwrite'

const DB_ID = 'academia_db'
const EXAMS_COLLECTION = 'exams'
const ATTEMPTS_COLLECTION = 'exam_attempts'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { attemptId, examId, answers, timeSpent } = body

  // Validate required fields
  if (!attemptId || !examId || !answers) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: attemptId, examId, answers'
    })
  }

  // Initialize Appwrite client with server API key
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(config.public.appwriteProject)
    .setKey(config.appwriteApiKey)

  const databases = new Databases(client)

  try {
    // Fetch the exam to get questions and passing score
    const exam = await databases.getDocument(DB_ID, EXAMS_COLLECTION, examId)
    const questions = JSON.parse(exam.questions || '[]')
    
    // Fetch the attempt to verify it exists and isn't already submitted
    const attempt = await databases.getDocument(DB_ID, ATTEMPTS_COLLECTION, attemptId)
    
    if (attempt.isSubmitted) {
      throw createError({
        statusCode: 400,
        statusMessage: 'This exam attempt has already been submitted'
      })
    }

    // Grade the exam
    let correctAnswers = 0
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach((question) => {
      const points = question.points || 1
      totalPoints += points
      
      // Check if the student's answer matches the correct answer
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
        earnedPoints += points
      }
    })

    // Calculate percentage score
    const score = totalPoints > 0 
      ? Math.round((earnedPoints / totalPoints) * 100)
      : 0

    // Determine if passed
    const passed = score >= exam.passingScore

    // Update the attempt with results
    const updatedAttempt = await databases.updateDocument(
      DB_ID,
      ATTEMPTS_COLLECTION,
      attemptId,
      {
        answers: JSON.stringify(answers),
        score,
        correctAnswers,
        totalQuestions: questions.length,
        isSubmitted: true,
        passed,
        submittedAt: new Date().toISOString(),
        timeSpent: timeSpent || 0
      }
    )

    // Return the result
    return {
      success: true,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      passed,
      passingScore: exam.passingScore,
      timeSpent: timeSpent || 0
    }
  }
  catch (error) {
    console.error('Exam submission error:', error)
    
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit exam: ' + (error.message || 'Unknown error')
    })
  }
})
