require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Entry = require('./models/entry')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
const getBody = (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ' '
}
morgan.token('body', getBody)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Backend info
app.get('/info', (request, response) => {
  Entry.find({}).then(entries => {
    response.send(`<div> Phonebook has info for ${entries.length} people. <br /> ${Date()} </div>`)
  })
})

// Get all entries
app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
})

// Get entry by id
app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then(entry => {
      if (entry) {
        response.json(entry)
      }   else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Delete entry by id
app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Add entry to the phonebook
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!(name && number)){
    return response.status(400).json({ error: 'name or number are missing' })
  }

  const newEntry = new Entry({
    name,
    number,
  })

  newEntry.save()
    .then( result => response.json(result))
    .catch( error => next(error))
})

// Edit entry
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const newEntry = {
    name: name,
    number: number,
  }

  Entry.findByIdAndUpdate(request.params.id, newEntry, { new: true })
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})

// Error handler middlewares
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})