import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite'

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6977adb0001756305181')

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)
const functions = new Functions(client)

export { client, account, databases, storage, functions, ID, Query }
