import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 3000

// Obtener todas las ofertas de trabajo
app.get('/jobs', (req, res) => {
  res.send('jobs')
})

// Obtener una oferta de trabajo por ID
app.get('/jobs/:id', (req, res) => {
  res.send('jobs por id')
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
