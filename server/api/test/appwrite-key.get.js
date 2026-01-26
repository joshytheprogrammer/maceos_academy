import { Client, TablesDB } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const client = new Client()
      .setEndpoint(config.public.appwriteEndpoint)
      .setProject(config.public.appwriteProject)
      .setKey(config.appwriteApiKey)

    const tablesDB = new TablesDB(client)

    // Try to list tables in academia_db
    const tables = await tablesDB.listTables({
      databaseId: 'academia_db'
    })

    return {
      success: true,
      message: 'API key is working!',
      tablesCount: tables.total,
      tables: tables.tables.map(t => t.name)
    }
  }
  catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.toString()
    }
  }
})