// Server-side API endpoint to approve a student application
// This adds the 'student' label to the user and updates the application status

import { Client, TablesDB, Users } from 'node-appwrite'
import { sendEmail, emailTemplates } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { applicationId, userId } = body

  if (!applicationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Application ID is required',
    })
  }

  const config = useRuntimeConfig()

  if (!config.appwriteApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Appwrite API key not configured',
    })
  }

  try {
    // Initialize Appwrite server SDK
    const client = new Client()
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProject)
      .setKey(config.appwriteApiKey)

    const tablesDB = new TablesDB(client)
    const users = new Users(client)

    const DB_ID = 'academia_db'
    const APPLICATIONS_COLLECTION = 'applications'

    // Get the application first to get user details
    let application
    try {
      application = await tablesDB.getRow({
        databaseId: DB_ID,
        tableId: APPLICATIONS_COLLECTION,
        rowId: applicationId,
      })
    } catch (docError) {
      console.error('Error fetching application row:', docError)
      throw createError({
        statusCode: 404,
        statusMessage: 'Application not found or error fetching data',
      })
    }

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Application not found',
      })
    }

    // Check if already approved
    if (application.status === 'approved') {
      return {
        success: true,
        message: 'Application already approved',
      }
    }

    // Update application status to approved
    await tablesDB.updateRow({
      databaseId: DB_ID,
      tableId: APPLICATIONS_COLLECTION,
      rowId: applicationId,
      data: {
        status: 'approved',
      },
    })

    // Add 'student' label to the user if userId is provided
    if (userId || application.userId) {
      const targetUserId = userId || application.userId
      
      try {
        // Get current user labels
        const user = await users.get(targetUserId)
        const currentLabels = user.labels || []
        
        // Add 'student' label if not already present
        if (!currentLabels.includes('student')) {
          const newLabels = [...currentLabels.filter(l => l !== 'pending'), 'student']
          await users.updateLabels(targetUserId, newLabels)
        }
      } catch (userError) {
        console.error('Error updating user labels:', userError)
        // Continue even if label update fails - application is still approved
      }
    }

    // Send approval email
    try {
      const emailContent = emailTemplates.applicationApproved({
        name: application.fullName,
        email: application.email,
      })

      await sendEmail(config, {
        to: application.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      })
    } catch (emailError) {
      console.error('Error sending approval email:', emailError)
      // Continue even if email fails - application is approved
    }

    return {
      success: true,
      message: 'Application approved successfully',
      applicationId,
    }
  } catch (error) {
    console.error('Error approving application:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to approve application',
    })
  }
})
