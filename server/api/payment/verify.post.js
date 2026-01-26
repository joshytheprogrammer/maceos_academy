// Server-side Paystack payment verification
// This endpoint verifies the payment with Paystack's API using the secret key

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { reference } = body

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
      return {
        success: true,
        verified: true,
        data: {
          reference: response.data.reference,
          amount: response.data.amount / 100, // Paystack returns amount in kobo
          currency: response.data.currency,
          channel: response.data.channel,
          paidAt: response.data.paid_at,
          customer: {
            email: response.data.customer.email,
          },
        },
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
