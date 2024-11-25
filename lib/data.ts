import pool from './db'
import { Course } from './definitions'


export async function getCourses(): Promise<Course[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(`
      SELECT 
        c.id, 
        c.title, 
        c.description, 
        c.instructor_id, 
        c.created_at,
        u.name AS instructor_name,
        u.email AS instructor_email,
        COUNT(DISTINCT ce.user_id) AS enrolled_students,
        COUNT(DISTINCT l.id) AS lesson_count
      FROM 
        courses c
      JOIN 
        users u ON c.instructor_id = u.id
      LEFT JOIN 
        course_enrollments ce ON c.id = ce.course_id
      LEFT JOIN
        lessons l ON c.id = l.course_id
      GROUP BY 
        c.id, u.id
      ORDER BY 
        c.created_at DESC
    `)
    return result.rows
  } finally {
    client.release()
  }
}