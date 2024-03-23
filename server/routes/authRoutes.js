import express from 'express'
import { UserModel } from '../models/mysql/jobs.js'

const authRouter = express.Router()

authRouter.get('/login', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

authRouter.get('/register', (req, res) => {
  res.sendFile(process.cwd() + '/client/register.html')
})

authRouter.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' })
    }

    const newUser = await UserModel.create({ username, password })

    res.status(201).json(newUser)
  } catch (error) {
    console.error('Error al registrar al usuario:', error)
    res.status(500).send('Error interno del servidor al registrar al usuario')
  }
})

authRouter.post('/auth', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' })
    }

    const result = await UserModel.auth({ username, password })
    if (result) {
      res.json(result)
    } else {
      res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' })
    }
  } catch (error) {
    console.error('Error al autenticar al usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor al hacer login' })
  }
})

export default authRouter
