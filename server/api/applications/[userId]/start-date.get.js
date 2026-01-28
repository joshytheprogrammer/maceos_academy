import { Client, Databases, Query } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  // Initialize Appwrite with server-side credentials
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(config.public.appwriteProject)
    .setKey(config.appwriteApiKey)

  const databases = new Databases(client)

  try {
    const response = await databases.listDocuments(
      'academia_db',
      'applications',
      [
        Query.equal('userId', userId),
        Query.equal('status', 'approved'),
        Query.limit(1)
      ]
    )

    if (response.documents.length > 0) {
      const app = response.documents[0]
      // Return both keys for compatibility
      const dateValue = app.programStartDate || app.$updatedAt || app.submittedAt
      return {
        startDate: dateValue,
        programStartDate: dateValue,
        applicationId: app.$id
      }
    }

    return { startDate: null, programStartDate: null }
  }
  catch (error) {
    console.error('Failed to fetch program start date:', error)
    return { startDate: null }
  }
})
