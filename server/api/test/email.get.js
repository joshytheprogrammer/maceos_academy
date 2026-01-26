// Test endpoint for email sending
import { sendEmail, emailTemplates } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const testEmail = query.email

  if (!testEmail) {
    return {
      success: false,
      error: 'Please provide an email address: /api/test/email?email=your@email.com'
    }
  }

  // Check if SMTP is configured
  if (!config.smtpHost || !config.smtpUser) {
    return {
      success: false,
      error: 'SMTP not configured. Check your .env file.',
      config: {
        host: config.smtpHost ? 'Set' : 'Missing',
        user: config.smtpUser ? 'Set' : 'Missing',
        pass: config.smtpPass ? 'Set' : 'Missing',
      }
    }
  }

  try {
    const template = emailTemplates.applicationSubmitted({
      name: 'Test User',
      email: testEmail,
      password: 'TestPassword123!',
    })

    const result = await sendEmail(config, {
      to: testEmail,
      subject: '[TEST] ' + template.subject,
      html: template.html,
      text: template.text,
    })

    return {
      success: result.success,
      message: result.success ? 'Test email sent!' : 'Failed to send email',
      messageId: result.messageId,
      error: result.error,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
})
