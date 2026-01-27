// Server-side content creation (admin only)
// Creates content with optional file upload

import { Client, TablesDB, ID, Users } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { 
    title, 
    description, 
    type, 
    week, 
    fileId, 
    fileName, 
    fileSize, 
    mimeType,
    downloadLimit,
    accessibleAfter,
    accessibleUntil,
    liveLink,
    liveStartTime,
    liveEndTime,
    isPublished,
    adminId 
  } = body

  // Validate required fields
  if (!title || !type || !week || !adminId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title, type, week, and admin ID are required',
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

  try {
    // Verify admin has correct label
    const admin = await users.get(adminId)
    if (!admin.labels?.includes('admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Unauthorized: Admin access required',
      })
    }

    // Create content document
    const contentData = {
      title,
      description: description || '',
      type,
      week: parseInt(week),
      fileId: fileId || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      mimeType: mimeType || null,
      downloadLimit: downloadLimit || 0, // 0 = unlimited
      accessibleAfter: accessibleAfter || null,
      accessibleUntil: accessibleUntil || null,
      liveLink: liveLink || null,
      liveStartTime: liveStartTime || null,
      liveEndTime: liveEndTime || null,
      isPublished: isPublished ?? false,
      createdBy: adminId
    }

    const doc = await tablesDB.createRow({
      databaseId: 'academia_db',
      tableId: 'content',
      rowId: ID.unique(),
      data: contentData
    })

    return {
      success: true,
      data: doc
    }
  }
  catch (error) {
    console.error('Content creation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create content',
    })
  }
})
