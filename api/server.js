const express = require('express')
const bodyParser = require('body-parser')
const mongo = require('mongodb')

const app = express()
const port = process.env.PORT || 5000
const client = new mongo.MongoClient('mongodb+srv://login:pass@db1-6u6ai.mongodb.net/test?retryWrites=true&w=majority',
    {
      useUnifiedTopology: true,
      poolSize: 2,
      promiseLibrary: global.Promise
    })

let user = ''

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.get('/api/hello', (req, res) => {
//   res.send({ express: 'Hello From Express' });
// });

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
              res.send({info: 'Logged successfully!', user: user, tasks: data[0].tasks})
              }
            })
        }
    })
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