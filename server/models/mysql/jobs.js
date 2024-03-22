import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
  static async getAll ({ title, location, salary }) {
    try {
      if (title) {
        const lowerCaseTitle = title.toLowerCase()

        const [titles] = await connection.query(
          'SELECT id, title FROM jobs WHERE LOWER(title) = ?;', [lowerCaseTitle]
        )

        if (titles.length === 0) {
          return []
        }

        const [{ id }] = titles
        const [rows] = await connection.query('SELECT * FROM jobs WHERE id = ?;', [id])

        return rows
      }

      if (location) {
        const lowerCaseLocation = location.toLowerCase()

        const [locations] = await connection.query(
          'SELECT id, location FROM jobs WHERE LOWER(location) = ?;', [lowerCaseLocation]
        )

        if (location.length === 0) {
          return []
        }

        const [{ id }] = locations
        const [rows] = await connection.query('SELECT * FROM jobs WHERE id = ?;', [id])

        return rows
      }

      if (salary) {
        const salaryNumber = Number(salary)
        const [rows] = await connection.query(
          'SELECT * FROM jobs WHERE salary = ?;', [salaryNumber]
        )
        return rows
      }

      const [rows] = await connection.query('SELECT * FROM jobs;')
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

  static async create ({ title, description, location, salary }) {
    try {
      const query = 'INSERT INTO jobs (title, description, location, salary) VALUES (?, ?, ?, ?)'

      const [result] = await connection.query(query, [title, description, location, salary])

      if (result.affectedRows === 1) {
        const newJobId = result.insertId

        const [newJob] = await connection.query(
          'SELECT * FROM jobs WHERE id = ?', newJobId
        )

        return newJob[0]
      } else {
        throw new Error('No se pudo crear la oferta de trabajo')
      }
    } catch (error) {
      console.error('Error al crear una nueva oferta de trabajo:', error)
      throw new Error('Error interno del servidor')
    }
  }

  static async update (id, { title, description, location, salary }) {
    if (!title && !description && !location && !salary) {
      throw new Error('Ningún campo proporcionado para actualizar')
    }

    const updates = []
    const queryParams = []

    if (title) {
      updates.push('title = ?')
      queryParams.push(title)
    }

    if (description) {
      updates.push('description = ?')
      queryParams.push(description)
    }

    if (location) {
      updates.push('location = ?')
      queryParams.push(location)
    }

    if (salary) {
      updates.push('salary = ?')
      queryParams.push(salary)
    }

    const query = `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`

    const [result] = await connection.query(query, [...queryParams, id])

    if (result.affectedRows === 1) {
      const [updatedJob] = await connection.query('SELECT * FROM jobs WHERE id = ?', [id])

      return updatedJob[0]
    } else {
      throw new Error('No se pudo actualizar la oferta de trabajo')
    }
  }

  static async delete (id) {
    try {
      const query = 'DELETE FROM jobs WHERE id = ?'
      await connection.query(query, [id])
    } catch (error) {
      console.error('Error al eliminar la oferta de trabajo:', error)
      throw new Error('Error interno del servidor al eliminar la oferta de trabajo')
    }
  }
}

export class UserModel {
  static async auth ({ username, password }) {
    try {
      const query = 'SELECT * FROM users WHERE `username` = ?'
      const [rows] = await connection.query(query, [username])

      if (rows.length === 0) {
        return null
      }

      const user = rows[0]

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (passwordMatch) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' })

        return { user, token }
      } else {
        return null // Contraseña incorrecta
      }
    } catch (error) {
      console.error('Error al autenticar al usuario:', error)
      throw new Error('Error interno del servidor al hacer login')
    }
  }
}
