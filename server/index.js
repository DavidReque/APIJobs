import express from 'express'
import { JobsModel, UserModel } from './models/mysql/jobs.js'
import { validateJob, validatePartialJob } from './schemas/jobs.js'

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
    const validationResult = validateJob(req.body)

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors })
    }

    const { data: validatedData } = validationResult

    const newJob = await JobsModel.create(validatedData)

    res.status(201).json(newJob)
  } catch (error) {
    console.error('Error al crear una nueva oferta de trabajo:', error)
    res.status(500).send('Error interno del servidor')
  }
})

// Actualizar una oferta de trabajo existente
app.patch('/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id // Obtener el ID de la oferta de trabajo de la URL
    const updateData = req.body // Obtener los datos de actualización del cuerpo de la solicitud

    const validationResult = validatePartialJob(updateData)

    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error })
    }

    await JobsModel.update(jobId, updateData)

    res.status(200).send('Oferta de trabajo actualizada correctamente')
  } catch (error) {
    console.error('Error al actualizar la oferta de trabajo:', error)
    res.status(500).send('Error interno del servidor al actualizar la oferta de trabajo')
  }
})

// Eliminar una oferta de trabajo existente
app.delete('/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id

    await JobsModel.delete(jobId)

    res.status(200).send('Oferta de trabajo eliminada correctamente')
  } catch (error) {
    console.error('Error al eliminar la oferta de trabajo:', error)
    res.status(500).send('Error interno del servidor al eliminar la oferta de trabajo')
  }
})

app.get('/login', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

app.get('/register', (req, res) => {
  res.sendFile(process.cwd() + '/client/register.html')
})

app.post('/register', async (req, res) => {
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

app.post('/auth', async (req, res) => {
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

app.listen(PORT, () => {
  console.log('server')
})
