import { Client, Databases } from 'node-appwrite'

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
    // STEP 1: Immediately save answers and mark as submitted (fast response)
    await databases.updateDocument(
      DB_ID,
      ATTEMPTS_COLLECTION,
      attemptId,
      {
        answers: JSON.stringify(answers),
        isSubmitted: true,
        submittedAt: new Date().toISOString(),
        timeSpent: timeSpent || 0
      }
    )

    // STEP 2: Grade in background (non-blocking)
    gradeExamInBackground(databases, examId, attemptId, answers)

    // Return immediately - grading happens in background
    return {
      success: true,
      submitted: true,
      message: 'Exam submitted successfully. Results are being calculated.'
    }
  }
  catch (error) {
    console.error('Exam submission error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit exam: ' + (error.message || 'Unknown error')
    })
  }
})

// Background grading function
async function gradeExamInBackground(databases, examId, attemptId, answers) {
  try {
    // Fetch the exam to get questions and passing score
    const exam = await databases.getDocument(DB_ID, EXAMS_COLLECTION, examId)
    const questions = JSON.parse(exam.questions || '[]')

    // Grade the exam
    let correctAnswers = 0
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach((question) => {
      const points = question.points || 1
      totalPoints += points
      
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

    // Update the attempt with graded results
    await databases.updateDocument(
      DB_ID,
      ATTEMPTS_COLLECTION,
      attemptId,
      {
        score,
        correctAnswers,
        totalQuestions: questions.length,
        passed
      }
    )

    console.log(`Exam ${attemptId} graded: ${score}% (${passed ? 'PASSED' : 'FAILED'})`)
  }
  catch (error) {
    console.error('Background grading error:', error)
    // Grading failed but submission was saved - can be retried or manually graded
  }
}
