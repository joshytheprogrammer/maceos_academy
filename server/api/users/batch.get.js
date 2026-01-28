import { Client, Users } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userIds = query.ids

  if (!userIds) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User IDs are required'
    })
  }

  // Parse IDs (comma-separated string or array)
  const ids = Array.isArray(userIds) ? userIds : userIds.split(',')

  // Initialize Appwrite client with server API key
  const config = useRuntimeConfig()
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(config.public.appwriteProject)
    .setKey(config.appwriteApiKey)

  const users = new Users(client)

  try {
    // Fetch user details for each ID
    const userDetails = await Promise.all(
      ids.map(async (id) => {
        try {
          const user = await users.get(id.trim())
          return {
            $id: user.$id,
            name: user.name || 'Unknown',
            email: user.email || '',
            labels: user.labels || []
          }
        } catch (e) {
          // Return placeholder if user not found
          return {
            $id: id,
            name: 'Unknown User',
            email: '',
            labels: []
          }
        }
      })
    )

    // Return as a map for easy lookup
    const userMap = {}
    userDetails.forEach(user => {
      userMap[user.$id] = user
    })

    return userMap
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user details'
    })
  }
})
