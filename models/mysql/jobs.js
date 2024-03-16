import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config()

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.PORT_DB,
  password: process.env.PASSWORD,
  database: process.env.DB
}

const connection = await mysql.createConnection(config)

export class JobsModel {
  static async getAll () {
    try {
      const [rows] = await connection.execute('SELECT * FROM jobs')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las películas:', error)
      throw new Error('Error interno del servidor')
    } finally {
      connection.end()
    }
  }

  static async getById (id) {
    try {
      const query = 'SELECT * FROM jobs WHERE id = ?'
      const rows = await connection.execute(query, [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la oferta de trabajo por ID:', error)
      throw new Error('Error interno del servidor')
    } finally {
      connection.end()
    }
  }
}
