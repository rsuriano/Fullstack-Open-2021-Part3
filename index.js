require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Entry = require('./models/entry')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
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

// Backend landing page
app.get('/', (request, response) => {
    response.send("<h1>phonebook api</h1>")
})

// Backend info
app.get('/info', (request, response) => {
    const resHTML = `<div> Phonebook has info for ${entries.length} people. <br /> ${Date()} </div>`
    response.send(resHTML)
})

// Get all entries
app.get('/api/persons', (request, response) => {
    Entry.find({}).then(entries => {
        response.json(entries)
        mongoose.connection.close()
    })
})

// Get entry by id
app.get('/api/persons/:id', (request, response) => {
    Entry.findById(request.params.id).then(note => {
        response.json(note)
        mongoose.connection.close()
    })
})

// Delete entry by id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    entries = entries.filter(entry => entry.id !== id)

    response.status(204).end()
})

const generateRandomId = () => {
    return Math.floor(Math.random() * 99999);
}  

// Add entry to the phonebook
app.post('/api/persons', (request, response) => {
    const data = request.body

    // if (!(data.name && data.number)){
    //     return response.status(400).json({ error: 'name or number are missing' })
    // }

    // if (entries.find(entry => entry.name === data.name)){
    //     return response.status(400).json({ error: 'name already exists in phonebook' })
    // }

    const newEntry = new Entry({
        id: generateRandomId(),
        name: data.name,
        number: data.number
    })
    newEntry.save().then( result => {
        response.json(result)
        mongoose.connection.close()
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})