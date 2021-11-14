import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import './TaskAdd.sass'

const cookies = new Cookies()

const handleLogin = async (email, pass) => {
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

const Login = props => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  return (
    <div className='login'>
        <span className='login-title'>Welcome back.</span>
        <span className='login-subtitle'>It is really nice to see you again!</span>
        <input className='login-input' value={email} onChange={e => setEmail(e.target.value)} placeholder='email' type='text' />
        <input className='login-input' value={pass} onChange={e => setPass(e.target.value)} placeholder='password' type='password' />
        <button className='login-button' onClick={ () => handleLogin(email, pass)}>Login</button>
        <span className='login-create' onClick={ () => props.setForgotScreen()}><strong>Forgot password?</strong><br/></span>
        <span className='login-create'>Don’t have an account? <br/><strong onClick={ () => props.setRegisterScreen()}>Create Account</strong></span>
        <span className='login-create' onClick={ () => props.setTaskScreen()}><strong>Back to ToDo</strong></span>
        <span className='logErr'></span>
        <span className='login-dot'></span>
    </div>
  )
}

export default Login