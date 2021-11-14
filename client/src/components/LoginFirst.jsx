import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import './TaskAdd.sass'

const cookies = new Cookies()

const handleLogin = async (email, pass, e) => {
  const errField = document.querySelector('.logErr')

  if (email.length < 6) {
      errField.innerText = 'Too short email!'
  }

  else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      errField.innerText = 'Incorrect email!'
  }

  else if (!pass.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)) {
      errField.innerText = 'Incorrect password'
  }

  else {
      errField.innerText = ''

      try {
          const response = await fetch('/login', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, pass }),
          })
          let answer = await response.text()
          answer = JSON.parse(answer)

          if (answer.tasks) {
              errField.innerText = answer.info
              cookies.set('login', answer.login)
              cookies.set('user', answer.user)

              cookies.set('tasks', answer.tasks)
              window.location.reload(false)

          } else {
              errField.innerText = answer.info
          }
        } catch (error) {
          console.log(error);
        }
  }
}

const LoginFirst = () => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  return (
      <div className='login-first'>
        <span className='login-title'>Nice to meet you!</span>
        <span className='login-subtitle'>We are glad to have a new user :)</span>
        <span className='login-subtitle'><strong>Log in</strong> and create your first task</span>
        <input className='login-input' value={email} onChange={e => setEmail(e.target.value)} placeholder='email' type='text' />
        <input className='login-input' value={pass} onChange={e => setPass(e.target.value)} placeholder='password' type='password' />
        <button className='login-button' onClick={ () => handleLogin(email, pass)}>Login</button>
        <span className='logErr'></span>
        <span className='login-dot'></span>
      </div>
  )
}

export default LoginFirst