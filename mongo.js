const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5) {
  console.log('Please provide the data with one of the following formats:')
  console.log('\t node.mongo.js <password> to get all entries')
  console.log('\t node.mongo.js <password> <name> <number> to add an entry')
  process.exit(1)
}

const [ password, entryName, entryNumber ] = process.argv.slice(2)

const url =
    `mongodb+srv://user1:${password}@fullstacktestdb.frwhy.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

// Show all entries if there is only one parameter (password)
if (process.argv.length < 4) {
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry)
    })
    mongoose.connection.close()
  })
}
// Add entry if there are 3 parameters (password, name, number)
else{
  const entry = new Entry({
    name: entryName,
    number: entryNumber,
  })

  entry.save().then( () => {
    console.log('entry saved!')
    mongoose.connection.close()
  })
}

