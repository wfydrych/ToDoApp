const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const path = require('path')

const app = express()
const port = process.env.PORT || 5000
const uri = "mongodb+srv://Fachman:HasloTestowe1@db1-6u6ai.mongodb.net/<dbname>?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true })

let user = ''

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.get('/api/hello', (req, res) => {
//   res.send({ express: 'Hello From Express' });
// });

// app.use(express.static(path.join(__dirname, 'build')))

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })

app.post('/register', (req, res) => {
  client.connect(err => {
      if (err) {
        res.send('Error during connecting to database :(')
        client.close()
      } else {
        const db = client.db('ToDoApp')
        const usersData = db.collection('UsersData')

        usersData.find({email: req.body.email}).toArray((err, data) => {
          if (err) {
            res.send('Error during connecting to database :(')
            client.close()
          } else if (data.length > 0) {
            res.send('Such email already exists in database!')
            client.close()
          }
          else {
              usersData.insertOne({email: req.body.email, login: req.body.login, password: req.body.pass, tasks: []}) 
              .then(result => {
                res.send('Account created!')
                client.close()
              })
              .catch(err => {
                res.send('Error during connecting to database :(')
                client.close()
              })
          }
        })
      }
  })
  client.close()
})

app.post('/login', (req, res) => {
    client.connect(err => {
        if (err) {
            res.send('Error during connecting to database :(')
            client.close()
        } else {
          const db = client.db('ToDoApp')
          const usersData = db.collection('UsersData')

          user = req.body.email

          usersData.find({email: user, password: req.body.pass}).toArray((err, data) => {
            if (err) {
              res.send('User not found!')
              client.close()
            }
            else if (data.length === 0) {
              res.send('Incorrect data!')
            }
            else {
              res.send({info: 'Logged successfully!', user: user, tasks: data[0].tasks, login: data[0].login})
              }
            })
        }
    })
  })

  app.post('/forgot', (req, res) => {
    user = req.body.email
    console.log(user)
  })

  app.post('/updatetask', (req, res) => {
    if (req.body.user) {
      client.connect(err => {
          if (err) {
              client.close()
          } else {
            const db = client.db('ToDoApp')
            const usersData = db.collection('UsersData')
            
            usersData.updateOne({email: req.body.user}, {$set: {tasks: req.body.tasks}})
          }
      })
    }
  })

app.listen(port, () => console.log(`Listening on port ${port}`))