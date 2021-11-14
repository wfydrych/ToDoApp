import React from 'react'
import login from './img/log.png'
import './StartMobile.sass'

const StartMobile = props => {
  return (
    <div className='startpage-mobile'>
      <div className='bgc-dots'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
      </div>
      <div className='login-bar'>
          <img className='login-img' src={login} alt='login' />
          <div className='log'>To<span>Do</span>App</div>
      </div>
      <span className='login-title'>Welcome!</span>
      <span className='login-subtitle'>Take control over your tasks.</span>
      <button className='login-button' onClick={ () => props.setTaskScreen()}>Try without account</button>
      <button className='login-button' onClick={ () => props.setLoginScreen()}>Log in</button>
      <button className='login-button' onClick={ () => props.setRegisterScreen()}>Sign in</button>
  </div>
  )
}

export default StartMobile
