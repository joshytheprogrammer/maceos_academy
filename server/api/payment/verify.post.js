// Server-side Paystack payment verification
// Verifies payment with Paystack API and stores in payments table

import { Client, TablesDB, ID, Query } from 'node-appwrite'
import { sendEmail, emailTemplates } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { reference, userId, applicationId, customerEmail, userName, tempPassword } = body

  if (!reference) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payment reference is required',
    })
  }

  const config = useRuntimeConfig()
  const secretKey = config.paystackSecretKey

  if (!secretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Paystack secret key not configured',
    })
  }

  // Initialize Appwrite client first for idempotency check
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProject)
    .setKey(config.appwriteApiKey)

  const tablesDB = new TablesDB(client)

  // Check if payment already exists (idempotency)
  try {
    const existingPayments = await tablesDB.listRows({
      databaseId: 'academia_db',
      tableId: 'payments',
      queries: [Query.equal('reference', reference)]
    })
    
    if (existingPayments.total > 0) {
      // Payment already processed - return success without duplicating
      console.log('Payment already processed:', reference)
      return {
        success: true,
        verified: true,
        alreadyProcessed: true,
        data: {
          reference: reference,
          amount: existingPayments.documents[0].amount,
        },
      }
    }
  }
  catch (checkError) {
    // Log but continue - better to risk duplicate than fail verification
    console.error('Could not check for existing payment:', checkError)
  }

  try {
    // Verify transaction with Paystack
    const response = await $fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.status && response.data.status === 'success') {
      const paymentData = {
        reference: response.data.reference,
        amount: response.data.amount / 100, // Paystack returns amount in kobo
        currency: response.data.currency,
        channel: response.data.channel,
        paidAt: response.data.paid_at,
        gatewayResponse: response.data.gateway_response,
        customerEmail: response.data.customer?.email || customerEmail,
      }

      // Store payment in database using server SDK
      try {
        // Create payment record
        await tablesDB.createRow({
          databaseId: 'academia_db',
          tableId: 'payments',
          rowId: ID.unique(),
          data: {
            userId: userId || '',
            applicationId: applicationId || '',
            reference: paymentData.reference,
            amount: Math.round(paymentData.amount),
            currency: paymentData.currency || 'NGN',
            status: 'completed',
            channel: paymentData.channel || '',
            gateway: 'paystack',
            gatewayResponse: paymentData.gatewayResponse || '',
            customerEmail: paymentData.customerEmail,
            ipAddress: getHeader(event, 'x-forwarded-for') || '',
            paidAt: paymentData.paidAt,
            verified: true,
            verifiedAt: new Date().toISOString(),
          }
        })

        // Also update the application's payment status
        if (applicationId) {
          await tablesDB.updateRow({
            databaseId: 'academia_db',
            tableId: 'applications',
            rowId: applicationId,
            data: {
              paymentStatus: 'completed',
              paymentAmount: Math.round(paymentData.amount),
              paymentReference: paymentData.reference,
              paymentVerified: true,
              status: 'pending', // Keep as pending - awaiting admin review
              submittedAt: new Date().toISOString(),
            }
          })
        }

        // Send welcome email with credentials
        if (tempPassword && paymentData.customerEmail) {
          try {
            const template = emailTemplates.applicationSubmitted({
              name: userName || 'Applicant',
              email: paymentData.customerEmail,
              password: tempPassword,
            })
            
            await sendEmail(config, {
              to: paymentData.customerEmail,
              subject: template.subject,
              html: template.html,
              text: template.text,
            })
            console.log('Welcome email sent to:', paymentData.customerEmail)
          }
          catch (emailError) {
            // Log but don't fail - payment is still successful
            console.error('Failed to send welcome email:', emailError)
          }
        }
      }
      catch (dbError) {
        // Log but don't fail verification if DB write fails
        console.error('Failed to store payment in database:', dbError)
      }

      return {
        success: true,
        verified: true,
        data: paymentData,
      }
    }
    else {
      return {
        success: false,
        verified: false,
        message: 'Payment verification failed',
        status: response.data?.status,
      }
    }
  }
  catch (error) {
    console.error('Paystack verification error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Payment verification failed',
    })
  }
})
