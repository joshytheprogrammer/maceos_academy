import { Client, Databases, Query } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const publishedOnly = query.published === 'true'

  // Initialize Appwrite with server-side credentials
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(config.public.appwriteProject)
    .setKey(config.appwriteApiKey)

  const databases = new Databases(client)

  try {
    const queries = [
      Query.orderAsc('week'),
      Query.limit(100)
    ]

    if (publishedOnly) {
      queries.push(Query.equal('isPublished', true))
    }

    const response = await databases.listDocuments(
      'academia_db',
      'exams',
      queries
    )

    // Parse questions JSON for each exam
    return response.documents.map(exam => ({
      ...exam,
      questions: JSON.parse(exam.questions || '[]')
    }))
  }
  catch (error) {
    console.error('Failed to fetch exams:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch exams'
    })
  }
})
