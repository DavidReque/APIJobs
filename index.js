import express from 'express'
import { JobsModel } from './models/mysql/jobs.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Obtener todas las ofertas de trabajo
app.get('/jobs', async (req, res) => {
  try {
    const { title, location, salary } = req.query
    const jobs = await JobsModel.getAll({ title, location, salary })
    res.json(jobs)
  } catch (error) {
    console.error('Error al obtener todas las ofertas de trabajo:', error)
    res.status(500).send('Error interno del servidor')
  }
})

// Obtener una oferta de trabajo por ID
app.get('/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id
    const job = await JobsModel.getById(jobId)

    if (job) {
      res.json(job)
    } else {
      res.status(404).send('Oferta de trabajo no encontrada')
    }
  } catch (error) {
    console.error('Error al obtener la oferta de trabajo por ID:', error)
    res.status(500).send('Error interno del servidor')
  }
})

// Crear una nueva oferta de trabajo
app.post('/jobs', async (req, res) => {
  try {
    const { title, description, location, salary } = req.body

    if (!title || !description || !location || !salary) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const newJob = await JobsModel.create({ title, description, location, salary })

    res.status(201).json(newJob)
  } catch (error) {
    console.error('Error al crear una nueva oferta de trabajo:', error)
    res.status(500).send('Error interno del servidor')
  }
})

// Actualizar una oferta de trabajo existente
app.patch('/jobs/:id', (req, res) => {
  res.send('actualizar')
})

// Eliminar una oferta de trabajo existente
app.delete('/jobs/:id', (req, res) => {
  res.send('eliminar')
})

app.listen(PORT, () => {
  console.log('server')
})
