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

export class JobsModel {
  static async getAll () {
    const connection = await mysql.createConnection(config)

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
}
