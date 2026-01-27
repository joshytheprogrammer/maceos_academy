// Server-side API endpoint to reject a student application
// Updates the application status to rejected

import { Client, TablesDB } from 'node-appwrite'
import { sendEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { applicationId, reason } = body

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

    const DB_ID = 'academia_db'
    const APPLICATIONS_COLLECTION = 'applications'

    // Get the application first
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

    // Check if already rejected
    if (application.status === 'rejected') {
      return {
        success: true,
        message: 'Application already rejected',
      }
    }

    // Update application status to rejected
    await tablesDB.updateRow({
      databaseId: DB_ID,
      tableId: APPLICATIONS_COLLECTION,
      rowId: applicationId,
      data: {
        status: 'rejected',
      },
    })

    // Send rejection email
    try {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #141414; border-radius: 16px; border: 1px solid #262626;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #262626;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
                <span style="color: #ffffff;">MACEOS</span><span style="color: #22c55e;">.</span>
              </h1>
              <p style="margin: 5px 0 0; color: #6b7280; font-size: 12px; letter-spacing: 3px;">ACADEMY</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">Application Update</h2>
              
              <p style="margin: 0 0 20px; color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                Dear ${application.fullName},
              </p>
              
              <p style="margin: 0 0 20px; color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in MACEOS Academy. After careful review of your application, we regret to inform you that we are unable to offer you a place in our program at this time.
              </p>
              
              ${reason ? `
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 24px; margin: 30px 0;">
                <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 14px;">Feedback:</h3>
                <p style="margin: 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">${reason}</p>
              </div>
              ` : ''}
              
              <p style="margin: 0 0 20px; color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                We encourage you to apply again in the future. If you have any questions, please don't hesitate to reach out.
              </p>
              
              <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 16px;">
                Best regards,<br>
                <span style="color: #ffffff;">MACEOS Academy Admissions Team</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0f0f0f; border-top: 1px solid #262626; border-radius: 0 0 16px 16px;">
              <p style="margin: 0; color: #404040; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} MACEOS Academy. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `

      await sendEmail(config, {
        to: application.email,
        subject: 'MACEOS Academy - Application Update',
        html: emailHtml,
        text: `Dear ${application.fullName},\n\nThank you for your interest in MACEOS Academy. After careful review of your application, we regret to inform you that we are unable to offer you a place in our program at this time.\n\n${reason ? `Feedback: ${reason}\n\n` : ''}We encourage you to apply again in the future.\n\nBest regards,\nMACEOS Academy Admissions Team`,
      })
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError)
      // Continue even if email fails
    }

    return {
      success: true,
      message: 'Application rejected',
      applicationId,
    }
  } catch (error) {
    console.error('Error rejecting application:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to reject application',
    })
  }
})
