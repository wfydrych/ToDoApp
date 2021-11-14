import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import './TaskAdd.sass'

const cookies = new Cookies()

const handleRegister = async (email, login, pass, confPass) => {
  const errField = document.querySelector('.regErr')

  if (email.length < 6) errField.innerText = 'Too short email!'

  else if (login.length < 3) errField.innerText = 'Too short login!'

  else if (pass !== confPass) errField.innerText = 'Passwords are not the same!'

  else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) errField.innerText = 'Incorrect email!'

  else if (!pass.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)) errField.innerText = 'Incorrect password!'

  else {
      errField.innetText = ''
      const response = await fetch('/register', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, login, pass }),
      })
      const answer = await response.text();
      errField.innerText = answer
  }
}   

const Register = props => {
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [pass, setPass] = useState('')
  const [confPass, setConfPass] = useState('')

  return (
    <div className='register'>
      <span className='login-title'>Join us!</span>
      <span className='login-subtitle'>Take control over your tasks.</span>
      <input className='login-input' value={email} onChange={e => setEmail(e.target.value)} placeholder='email' type='text' />
      <input className='login-input' value={login} onChange={e => setLogin(e.target.value)} placeholder='login' type='text' />
      <input className='login-input' value={pass} onChange={e => setPass(e.target.value)} placeholder='password' type='password' />
      <input className='login-input' value={confPass} onChange={e => setConfPass(e.target.value)} placeholder='confirm password' type='password' />
      <button className='login-button' onClick={ () => handleRegister(email, login, pass, confPass)}>Register</button>
      <span className='login-create' onClick={ () => props.setTaskScreen()}><strong>Back to ToDo</strong></span>
      <span className='regErr'></span>
      <span className='login-dot'></span>
      <span className='register-hint'>
          Password must have at least:<br/>
          - 1 letter<br/>
          - 1 number<br/>
          - 6 signs<br/>
      </span>
    </div>
  )
}

export default Register