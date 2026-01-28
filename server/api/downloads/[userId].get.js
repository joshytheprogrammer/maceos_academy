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
      'download_logs',
      [
        Query.equal('userId', userId),
        Query.limit(500)
      ]
    )

    return response.documents
  }
  catch (error) {
    console.error('Failed to fetch downloads:', error)
    // Return empty array instead of error to not break the schedule
    return []
  }
})
