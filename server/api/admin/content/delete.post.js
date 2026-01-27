// Server-side content deletion (admin only)
// Deletes content and associated file from storage

import { Client, TablesDB, Users, Storage } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { contentId, adminId } = body

  if (!contentId || !adminId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content ID and Admin ID are required',
    })
  }

  const config = useRuntimeConfig()

  // Initialize Appwrite server client
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProject)
    .setKey(config.appwriteApiKey)

  const tablesDB = new TablesDB(client)
  const users = new Users(client)
  const storage = new Storage(client)

  try {
    // Verify admin has correct label
    const admin = await users.get(adminId)
    if (!admin.labels?.includes('admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Unauthorized: Admin access required',
      })
    }

    // Get the content to find associated file
    const content = await tablesDB.getRow({
      databaseId: 'academia_db',
      tableId: 'content',
      rowId: contentId
    })

    // Delete associated file if exists
    if (content.fileId) {
      try {
        await storage.deleteFile('course_materials', content.fileId)
      }
      catch (e) {
        console.warn('Could not delete file:', e.message)
        // Continue even if file deletion fails
      }
    }

    // Delete the content document
    await tablesDB.deleteRow({
      databaseId: 'academia_db',
      tableId: 'content',
      rowId: contentId
    })

    return {
      success: true,
      message: 'Content deleted successfully'
    }
  }
  catch (error) {
    console.error('Content deletion error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete content',
    })
  }
})
