import { Client, Databases, Query } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.params
  const config = useRuntimeConfig()

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    .setKey(config.appwriteApiKey)

  const databases = new Databases(client)

  try {
    // Find the user's most recent application
    const response = await databases.listDocuments(
      'academia_db',
      'applications',
      [
        Query.equal('user_id', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    )

    if (response.documents.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No application found'
      })
    }

    const application = response.documents[0]
    
    return {
      status: application.status,
      createdAt: application.$createdAt
    }
  } catch (error) {
    if (error.statusCode === 404) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch application status'
    })
  }
})
