import { Client, Databases } from 'node-appwrite'

const DB_ID = 'academia_db'
const EXAMS_TABLE = 'exams'
const ATTEMPTS_TABLE = 'exam_attempts'

export default async ({ req, res, log, error }) => {
  // Parse the request body
  let body
  try {
    body = JSON.parse(req.body || '{}')
  } catch (e) {
    error('Invalid JSON body')
    return res.json({ success: false, error: 'Invalid request body' }, 400)
  }

  const { attemptId, examId, answers, timeSpent } = body

  // Validate required fields
  if (!attemptId || !examId || !answers) {
    error('Missing required fields')
    return res.json({
      success: false,
      error: 'Missing required fields: attemptId, examId, answers'
    }, 400)
  }

  // Initialize Appwrite client with function's API key
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY)

  const databases = new Databases(client)

  try {
    // Fetch the exam to get questions and passing score
    log(`Fetching exam: ${examId}`)
    const exam = await databases.getDocument(DB_ID, EXAMS_TABLE, examId)
    
    let questions
    try {
      questions = typeof exam.questions === 'string' 
        ? JSON.parse(exam.questions) 
        : exam.questions || []
    } catch (e) {
      questions = []
    }

    if (!questions.length) {
      error('Exam has no questions')
      return res.json({ success: false, error: 'Exam has no questions' }, 400)
    }

    // Fetch the attempt to verify it exists and isn't already submitted
    log(`Fetching attempt: ${attemptId}`)
    const attempt = await databases.getDocument(DB_ID, ATTEMPTS_TABLE, attemptId)

    if (attempt.isSubmitted) {
      error('Attempt already submitted')
      return res.json({
        success: false,
        error: 'This exam attempt has already been submitted'
      }, 400)
    }

    // Verify attempt belongs to this exam
    if (attempt.examId !== examId) {
      error('Attempt does not match exam')
      return res.json({
        success: false,
        error: 'Invalid attempt for this exam'
      }, 400)
    }

    // Grade the exam
    log('Grading exam...')
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
    const passed = score >= (exam.passingScore || 70)

    log(`Score: ${score}%, Correct: ${correctAnswers}/${questions.length}, Passed: ${passed}`)

    // Update the attempt with results
    await databases.updateDocument(
      DB_ID,
      ATTEMPTS_TABLE,
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

    log('Exam graded successfully')

    // Return the result (without exposing correct answers)
    return res.json({
      success: true,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      passed,
      passingScore: exam.passingScore || 70,
      timeSpent: timeSpent || 0
    })
  } catch (e) {
    error(`Grading error: ${e.message}`)
    return res.json({
      success: false,
      error: 'Failed to grade exam: ' + e.message
    }, 500)
  }
}
