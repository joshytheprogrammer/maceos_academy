// Server-side download with tracking and limit enforcement
// Logs download and checks against downloadLimit

import { Client, TablesDB, ID, Query, Storage } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { contentId, userId } = body

  if (!contentId || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content ID and User ID are required',
    })
  }

  const config = useRuntimeConfig()

  // Initialize Appwrite server client
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProject)
    .setKey(config.appwriteApiKey)

  const tablesDB = new TablesDB(client)
  const storage = new Storage(client)

  try {
    // Get the content document
    const content = await tablesDB.getRow({
      databaseId: 'academia_db',
      tableId: 'content',
      rowId: contentId
    })

    if (!content) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Content not found',
      })
    }

    // Check if content is published
    if (!content.isPublished) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Content is not available',
      })
    }

    // Check accessibility dates
    const now = new Date()
    if (content.accessibleAfter && new Date(content.accessibleAfter) > now) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Content is not yet accessible',
      })
    }
    if (content.accessibleUntil && new Date(content.accessibleUntil) < now) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Content is no longer accessible',
      })
    }

    // Check download limit if set
    if (content.downloadLimit && content.downloadLimit > 0) {
      const existingDownloads = await tablesDB.listRows({
        databaseId: 'academia_db',
        tableId: 'download_logs',
        queries: [
          Query.equal('contentId', contentId),
          Query.equal('userId', userId)
        ]
      })

      if (existingDownloads.total >= content.downloadLimit) {
        throw createError({
          statusCode: 403,
          statusMessage: `Download limit reached (${content.downloadLimit} downloads allowed)`,
        })
      }
    }

    // Log the download
    await tablesDB.createRow({
      databaseId: 'academia_db',
      tableId: 'download_logs',
      rowId: ID.unique(),
      data: {
        contentId,
        userId,
        downloadedAt: now.toISOString(),
        ipAddress: getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || '',
        userAgent: (getHeader(event, 'user-agent') || '').substring(0, 500)
      }
    })

    // Get download URL from storage
    if (!content.fileId) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No file associated with this content',
      })
    }

    // Get file download buffer
    const fileBuffer = await storage.getFileDownload('course_materials', content.fileId)

    return {
      success: true,
      fileName: content.fileName || 'download',
      mimeType: content.mimeType || 'application/octet-stream',
      fileId: content.fileId
    }
  }
  catch (error) {
    console.error('Download error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to process download',
    })
  }
})
