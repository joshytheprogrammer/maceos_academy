import { client } from '~/utils/appwrite'

export default defineNuxtPlugin(async () => {
  try {
    const response = await client.ping()
    console.log('✅ Appwrite connection successful:', response)
  }
  catch (error) {
    console.error('❌ Appwrite connection failed:', error)
  }
})
