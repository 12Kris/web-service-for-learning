import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './db'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function seed(): Promise<void> {
  const client = await pool.connect()

  try {
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
    await client.query(seedSQL)
    console.log('Database seeded successfully')
  } catch (err) {
    console.error('Error seeding database:', err)
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch((err) => {
  console.error('Unhandled error in seed function:', err)
  process.exit(1)
})