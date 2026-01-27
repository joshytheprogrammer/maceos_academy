import { databases, storage, ID, Query } from '~/utils/appwrite'

const DB_ID = 'academia_db'
const CONTENT_COLLECTION = 'content'
const DOWNLOAD_LOGS_COLLECTION = 'download_logs'
const STORAGE_BUCKET = 'course_materials'

export const useContent = () => {
  const content = useState('content_list', () => [])
  const loading = useState('content_loading', () => false)
  const error = useState('content_error', () => null)

  /**
   * Fetch all content (admin view - all content)
   */
  const fetchAllContent = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const queries = [Query.orderDesc('$createdAt'), Query.limit(100)]
      
      if (filters.week) {
        queries.push(Query.equal('week', parseInt(filters.week)))
      }
      if (filters.type) {
        queries.push(Query.equal('type', filters.type))
      }
      if (typeof filters.isPublished === 'boolean') {
        queries.push(Query.equal('isPublished', filters.isPublished))
      }

      const response = await databases.listDocuments(DB_ID, CONTENT_COLLECTION, queries)
      content.value = response.documents
      return { success: true, data: response.documents, total: response.total }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Fetch published content for students (respects date windows)
   */
  const fetchStudentContent = async (week = null) => {
    loading.value = true
    error.value = null
    
    try {
      const now = new Date().toISOString()
      const queries = [
        Query.equal('isPublished', true),
        Query.orderAsc('week'),
        Query.orderAsc('$createdAt'),
        Query.limit(100)
      ]
      
      if (week) {
        queries.push(Query.equal('week', parseInt(week)))
      }

      const response = await databases.listDocuments(DB_ID, CONTENT_COLLECTION, queries)
      
      // Filter by accessibility dates client-side (Appwrite doesn't support complex date queries)
      const accessibleContent = response.documents.filter(item => {
        const afterOk = !item.accessibleAfter || new Date(item.accessibleAfter) <= new Date(now)
        const untilOk = !item.accessibleUntil || new Date(item.accessibleUntil) >= new Date(now)
        return afterOk && untilOk
      })
      
      content.value = accessibleContent
      return { success: true, data: accessibleContent, total: accessibleContent.length }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Get single content item by ID
   */
  const getContent = async (contentId) => {
    try {
      const doc = await databases.getDocument(DB_ID, CONTENT_COLLECTION, contentId)
      return { success: true, data: doc }
    }
    catch (e) {
      return { success: false, error: e.message }
    }
  }

  /**
   * Create new content (admin only)
   */
  const createContent = async (data) => {
    loading.value = true
    error.value = null
    
    try {
      const doc = await databases.createDocument(
        DB_ID,
        CONTENT_COLLECTION,
        ID.unique(),
        data
      )
      return { success: true, data: doc }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Update content (admin only)
   */
  const updateContent = async (contentId, data) => {
    loading.value = true
    error.value = null
    
    try {
      const doc = await databases.updateDocument(
        DB_ID,
        CONTENT_COLLECTION,
        contentId,
        data
      )
      return { success: true, data: doc }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Delete content (admin only)
   */
  const deleteContent = async (contentId, fileId = null) => {
    loading.value = true
    error.value = null
    
    try {
      // Delete the file from storage if exists
      if (fileId) {
        try {
          await storage.deleteFile(STORAGE_BUCKET, fileId)
        }
        catch (e) {
          console.warn('Could not delete file:', e.message)
        }
      }
      
      // Delete the document
      await databases.deleteDocument(DB_ID, CONTENT_COLLECTION, contentId)
      return { success: true }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Upload file to storage (admin only)
   */
  const uploadFile = async (file) => {
    try {
      const response = await storage.createFile(
        STORAGE_BUCKET,
        ID.unique(),
        file
      )
      return { 
        success: true, 
        data: {
          fileId: response.$id,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type
        }
      }
    }
    catch (e) {
      return { success: false, error: e.message }
    }
  }

  /**
   * Get file download URL
   */
  const getFileDownloadUrl = (fileId) => {
    return storage.getFileDownload(STORAGE_BUCKET, fileId)
  }

  /**
   * Get file view URL (for preview)
   */
  const getFileViewUrl = (fileId) => {
    return storage.getFileView(STORAGE_BUCKET, fileId)
  }

  /**
   * Log a download
   */
  const logDownload = async (contentId, userId) => {
    try {
      await databases.createDocument(
        DB_ID,
        DOWNLOAD_LOGS_COLLECTION,
        ID.unique(),
        {
          contentId,
          userId,
          downloadedAt: new Date().toISOString(),
        }
      )
      return { success: true }
    }
    catch (e) {
      console.warn('Could not log download:', e.message)
      return { success: false, error: e.message }
    }
  }

  /**
   * Get download count for a content item
   */
  const getDownloadCount = async (contentId) => {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        DOWNLOAD_LOGS_COLLECTION,
        [Query.equal('contentId', contentId)]
      )
      return { success: true, count: response.total }
    }
    catch (e) {
      return { success: false, count: 0, error: e.message }
    }
  }

  /**
   * Check if user has already downloaded (for download limit enforcement)
   */
  const getUserDownloadCount = async (contentId, userId) => {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        DOWNLOAD_LOGS_COLLECTION,
        [
          Query.equal('contentId', contentId),
          Query.equal('userId', userId)
        ]
      )
      return { success: true, count: response.total }
    }
    catch (e) {
      return { success: false, count: 0, error: e.message }
    }
  }

  /**
   * Group content by week
   */
  const contentByWeek = computed(() => {
    const grouped = {}
    for (const item of content.value) {
      const week = item.week || 1
      if (!grouped[week]) {
        grouped[week] = []
      }
      grouped[week].push(item)
    }
    return grouped
  })

  /**
   * Get content type icon
   */
  const getTypeIcon = (type) => {
    const icons = {
      'pdf': 'picture_as_pdf',
      'video': 'play_circle',
      'document': 'description',
      'presentation': 'slideshow',
      'spreadsheet': 'table_chart',
      'live-link': 'videocam',
      'exam': 'quiz',
      'audio': 'headphones',
      'archive': 'folder_zip'
    }
    return icons[type] || 'insert_drive_file'
  }

  /**
   * Get content type color
   */
  const getTypeColor = (type) => {
    const colors = {
      'pdf': 'text-red-400',
      'video': 'text-purple-400',
      'document': 'text-blue-400',
      'presentation': 'text-orange-400',
      'spreadsheet': 'text-green-400',
      'live-link': 'text-cyan-400',
      'exam': 'text-amber-400',
      'audio': 'text-pink-400',
      'archive': 'text-gray-400'
    }
    return colors[type] || 'text-gray-400'
  }

  /**
   * Format file size
   */
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return {
    content,
    loading,
    error,
    contentByWeek,
    fetchAllContent,
    fetchStudentContent,
    getContent,
    createContent,
    updateContent,
    deleteContent,
    uploadFile,
    getFileDownloadUrl,
    getFileViewUrl,
    logDownload,
    getDownloadCount,
    getUserDownloadCount,
    getTypeIcon,
    getTypeColor,
    formatFileSize
  }
}
