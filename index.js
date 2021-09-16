const { response, request } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
const getBody = (request, response) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : ' '
}
morgan.token('body', getBody)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send("<h1>phonebook api</h1>")
})

app.get('/info', (request, response) => {
    const resHTML = `<div> Phonebook has info for ${entries.length} people. <br /> ${Date()} </div>`
    response.send(resHTML)
})

app.get('/api/persons', (request, response) => {
    response.json(entries)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    entry = entries.find(entry => entry.id === id)
    if (entry){
        response.json(entry)
    } else{
        response.status(404).send('The resource was not found')
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    entries = entries.filter(entry => entry.id !== id)

    response.status(204).end()
})

const generateRandomId = () => {
    return Math.floor(Math.random() * 99999);
  }  

app.post('/api/persons', (request, response) => {
    const data = request.body

    if (!(data.name && data.number)){
        return response.status(400).json({ error: 'name or number are missing' })
    }

    if (entries.find(entry => entry.name === data.name)){
        return response.status(400).json({ error: 'name already exists in phonebook' })
    }

    const newEntry = {
        id: generateRandomId(),
        name: data.name,
        number: data.number
    }
    entries = entries.concat(newEntry)
    response.json(newEntry)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})