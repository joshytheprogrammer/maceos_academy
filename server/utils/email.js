// Reusable email utility using nodemailer
import nodemailer from 'nodemailer'

/**
 * Create and return a configured email transporter
 */
export const createTransporter = (config) => {
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: parseInt(config.smtpPort),
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    // Extended timeout settings
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  })
}

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Send an email with retry logic
 * @param {Object} config - Runtime config with SMTP settings
 * @param {Object} options - Email options (to, subject, html, text)
 * @param {number} maxRetries - Maximum number of retry attempts (default: 10)
 */
export const sendEmail = async (config, options, maxRetries = 10) => {
  const mailOptions = {
    from: `"${config.smtpFromName}" <${config.smtpFromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  }

  let lastError = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Create a fresh transporter for each attempt
      const transporter = createTransporter(config)
      
      // Verify connection before sending
      let verified = false
      let verifyAttempts = 0
      const maxVerifyAttempts = 3
      
      while (!verified && verifyAttempts < maxVerifyAttempts) {
        try {
          await transporter.verify()
          verified = true
        } catch (verifyError) {
          verifyAttempts++
          console.log(`[Email] SMTP verify attempt ${verifyAttempts}/${maxVerifyAttempts} failed:`, verifyError.message)
          if (verifyAttempts < maxVerifyAttempts) {
            await sleep(2000) // Wait 2 seconds before retry
          }
        }
      }
      
      if (!verified) {
        throw new Error('Failed to verify SMTP connection after multiple attempts')
      }
      
      // Send the email
      const result = await transporter.sendMail(mailOptions)
      console.log(`[Email] Sent successfully to ${options.to} on attempt ${attempt}`)
      return { success: true, messageId: result.messageId }
      
    } catch (error) {
      lastError = error
      console.error(`[Email] Send attempt ${attempt}/${maxRetries} failed:`, error.message)
      
      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s, 16s... capped at 30s
        const delay = Math.min(2000 * Math.pow(2, attempt - 1), 30000)
        console.log(`[Email] Retrying in ${delay / 1000} seconds...`)
        await sleep(delay)
      }
    }
  }
  
  // All retries exhausted
  console.error(`[Email] All ${maxRetries} attempts failed. Last error:`, lastError?.message)
  return { success: false, error: lastError?.message || 'Failed to send email after multiple retries' }
}

/**
 * Email Templates
 */
export const emailTemplates = {
  /**
   * Application submitted with password email
   */
  applicationSubmitted: (data) => ({
    subject: 'Welcome to MACEOS Academy - Application Received',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MACEOS Academy</title>
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
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px;">Welcome, ${data.name}! 🎉</h2>
              
              <p style="margin: 0 0 20px; color: #a3a3a3; font-size: 16px; line-height: 1.6;">
                Your application to MACEOS Academy has been successfully submitted and your payment has been confirmed.
              </p>
              
              <!-- Credentials Box -->
              <div style="background-color: #1a1a1a; border: 1px solid #22c55e33; border-radius: 12px; padding: 24px; margin: 30px 0;">
                <h3 style="margin: 0 0 16px; color: #22c55e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Login Credentials</h3>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #6b7280; font-size: 14px;">Email:</span>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="color: #ffffff; font-size: 14px; font-family: monospace;">${data.email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #6b7280; font-size: 14px;">Temporary Password:</span>
                    </td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="color: #22c55e; font-size: 14px; font-family: monospace; background-color: #22c55e1a; padding: 4px 8px; border-radius: 4px;">${data.password}</span>
                    </td>
                  </tr>
                </table>
                
                <p style="margin: 16px 0 0; color: #f97316; font-size: 13px;">
                  ⚠️ Please change your password after your first login for security.
                </p>
              </div>
              
              <!-- Status -->
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 24px; margin: 30px 0;">
                <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 16px;">Application Status</h3>
                <p style="margin: 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
                  Your application is now <span style="color: #22c55e; font-weight: 600;">under review</span>. Our admissions team will evaluate your application within <strong style="color: #ffffff;">3-5 business days</strong>.
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://academy.maceos.com/login" style="display: inline-block; background-color: #22c55e; color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Login to Dashboard
                </a>
              </div>
              
              <!-- What's Next -->
              <div style="border-top: 1px solid #262626; padding-top: 30px; margin-top: 30px;">
                <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 16px;">What happens next?</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #a3a3a3; font-size: 14px; line-height: 2;">
                  <li>Our team reviews your application</li>
                  <li>You'll receive an email with the decision</li>
                  <li>If accepted, you'll get full access to course materials</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0f0f0f; border-top: 1px solid #262626; border-radius: 0 0 16px 16px;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; text-align: center;">
                Questions? Contact us at <a href="mailto:support@maceos.academy" style="color: #22c55e; text-decoration: none;">support@maceos.academy</a>
              </p>
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
    `,
    text: `
Welcome to MACEOS Academy, ${data.name}!

Your application has been successfully submitted and payment confirmed.

YOUR LOGIN CREDENTIALS
Email: ${data.email}
Temporary Password: ${data.password}

⚠️ Please change your password after your first login for security.

APPLICATION STATUS
Your application is under review. Our admissions team will evaluate it within 3-5 business days.

WHAT'S NEXT
- Our team reviews your application
- You'll receive an email with the decision
- If accepted, you'll get full access to course materials

Login at: https://academy.maceos.com/login

Questions? Contact us at support@maceos.academy

© ${new Date().getFullYear()} MACEOS Academy
    `,
  }),

  /**
   * Application approved email
   */
  applicationApproved: (data) => ({
    subject: '🎉 Congratulations! Your MACEOS Academy Application is Approved',
    html: `
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
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 64px;">🎉</span>
              </div>
              
              <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; text-align: center;">Congratulations, ${data.name}!</h2>
              
              <p style="margin: 0 0 20px; color: #a3a3a3; font-size: 16px; line-height: 1.6; text-align: center;">
                We're thrilled to inform you that your application to MACEOS Academy has been <span style="color: #22c55e; font-weight: 600;">approved</span>!
              </p>
              
              <div style="background-color: #22c55e1a; border: 1px solid #22c55e33; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
                <p style="margin: 0; color: #22c55e; font-size: 18px; font-weight: 600;">
                  You now have full access to all course materials!
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://academy.maceos.com/dashboard" style="display: inline-block; background-color: #22c55e; color: #0a0a0a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>
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
    `,
    text: `
Congratulations, ${data.name}! 🎉

Your application to MACEOS Academy has been APPROVED!

You now have full access to all course materials.

Login at: https://academy.maceos.com/dashboard

© ${new Date().getFullYear()} MACEOS Academy
    `,
  }),
}
