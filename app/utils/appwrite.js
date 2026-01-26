import { Client, Account, Databases } from 'appwrite'

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6977adb0001756305181')

const account = new Account(client)
const databases = new Databases(client)

export { client, account, databases }
