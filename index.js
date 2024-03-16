import express from 'express'
import { JobsModel } from './models/mysql/jobs.js'

const app = express()
const PORT = process.env.PORT ?? 3000

// Obtener todas las ofertas de trabajo
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await JobsModel.getAll()
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

// Buscar ofertas de trabajo por criterios específicos
app.get('/jobs/search', (req, res) => {
  res.send('busqueda')
})

// Crear una nueva oferta de trabajo
app.post('/jobs', (req, res) => {
  res.send(' crear una nueva oferta de trabajo')
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
