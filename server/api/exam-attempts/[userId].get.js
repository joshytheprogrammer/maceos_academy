import { Client, Databases, Query } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  const config = useRuntimeConfig()

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(config.public.appwriteProject)
    .setKey(config.appwriteApiKey)

  const databases = new Databases(client)

  try {
    const response = await databases.listDocuments(
      'academia_db',
      'exam_attempts',
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    )

    return response.documents
  } catch (error) {
    console.error('Failed to fetch exam attempts:', error)
    return []
  }
})
