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
      const [rows] = await connection.query('SELECT * FROM jobs')
      return rows
    } catch (error) {
      console.error('Error al obtener todas las películas:', error)
      throw new Error('Error interno del servidor')
    }
  }

  static async getById (id) {
    try {
      const query = 'SELECT * FROM jobs WHERE id = ?'
      const [rows] = await connection.query(query, [id])
      return rows.length ? rows[0] : null
    } catch (error) {
      console.error('Error al obtener la oferta de trabajo por ID:', error)
      throw new Error('Error interno del servidor')
    }
  }

  static async search ({ title, location, salary }) {
    try {
      let query = 'SELECT * FROM jobs WHERE 1'
      const queryParams = []

      if (title) {
        query += ' AND title LIKE ?' // Añadimos una condición para buscar títulos que contengan el texto proporcionado
        queryParams.push(`%${title.toLowerCase()}%`) // Convertimos el título proporcionado a minúsculas antes de añadirlo a los parámetros de consulta
      }

      if (location) {
        query += ' AND title LIKE ?'
        queryParams.push(`%${location.toLowerCase()}%`)
      }

      if (salary) {
        query += ' AND salary = ?'
        queryParams.push(salary)
      }

      const [rows] = await connection.query(query, queryParams)

      return rows
    } catch (error) {
      console.error('Error al buscar ofertas de trabajo por criterios específicos:', error)
      throw new Error('Error interno del servidor')
    }
  }
}
