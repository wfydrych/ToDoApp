const express = require('express')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const nodemailer = require('nodemailer')
const passwordHash = require('password-hash')

const app = express()
const port = process.env.PORT || 5000
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})

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
              const hashedPassword = passwordHash.generate(req.body.pass)
              usersData.insertOne({email: req.body.email, login: req.body.login, password: hashedPassword, tasks: []}) 
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
          const answer = {
            info: 'Error during connecting to database :('
          }
          res.send(JSON.stringify(answer))
          client.close()
        } else {
          const db = client.db('ToDoApp')
          const usersData = db.collection('UsersData')

          const user = req.body.email
          const pass = req.body.pass

            usersData.find({email: user}).toArray((err, data) => {
            if (err) {
              const answer = {
                info: 'Incorrect data!'
              }
              res.send(JSON.stringify(answer))
              client.close()
            }
            else if (data.length === 0) {
              const answer = {
                info: 'User not found!'
              }
              res.send(JSON.stringify(answer))
            }
            else {
              const passCorrect = passwordHash.verify(pass, data[0].password)
              
              if (passCorrect) {
                const answer = {
                  info: 'Logged successfully!', 
                  user: user, 
                  tasks: data[0].tasks, 
                  login: data[0].login
                }
                res.send(JSON.stringify(answer))
                } else {
                  const answer = {
                    info: 'Incorrect password!'
                  }
                  res.send(JSON.stringify(answer))
                }
              }
            })
        }
    })
  })

  app.post('/forgot', (req, res) => {
    const user = req.body.email

    client.connect(err => {
      if (err) {
          client.close()
      } else {
        const db = client.db('ToDoApp')
        const usersData = db.collection('UsersData')

        usersData.find({email: user}).toArray((err, data) => {
          if (err) {
            client.close()
          }
          else if (data.length === 0) {
            client.close()
          }
          else {
            const pass = data[0].password
            
            const transport = nodemailer.createTransport({
              host: "smtp.mailtrap.io",
              port: 2525,
              auth: {
                user: "0ca3365018a1e6",
                pass: "e1127133ab163a"
              }
            })
            const message = {
              from: 'todo@app.com',
              to: user,
              subject: 'Your ToDoApp password',
              text: 'Your password is: ' + pass 
          }
            transport.sendMail(message, function(err, info) {
              if (err) {
                console.log('Error')
              } else {
                console.log('Done');
              }
            })
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