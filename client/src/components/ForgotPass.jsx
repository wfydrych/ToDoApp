import React, { useState } from 'react'
import './TaskAdd.sass'

const handleSendForgot = props => {
  const err = document.querySelector('.forgotErr')
  const email = props
  console.log(props)
  
  if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) err.innerText = 'Incorrect email!'
  else {
      err.innerText = 'Password sent!'

      const response = fetch('/forgot', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
      })
  }
}

const ForgotPass = props => {
  const [email, setEmail] = useState('')

  return (
    <div className='forgot-pass'>
        <span className='login-title'>Forgot password?</span>
        <input className='login-input' value={email} onChange={e => setEmail(e.target.value)} placeholder='email' type='text' />
        <button className='login-button' onClick={ () => handleSendForgot(email)}>Send</button>
        <span className='login-create' onClick={ () => props.setTaskScreen()}><strong>Back to ToDo</strong></span>
        <span className='forgotErr'></span>
    </div>
  )
}

export default ForgotPass