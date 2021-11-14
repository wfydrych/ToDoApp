import React from 'react'
import Cookies from 'universal-cookie'
import login from './img/log.png'
import './TaskAdd.sass'

const cookies = new Cookies()

const signBtn = props => {
  const x = window.matchMedia('(max-width: 1023px)')
  // if (x.matches) return ''
  if (cookies.get('login')) return ''
  else return <div className="log" onClick={ () => props.setRegisterScreen()}>Sign up</div>
}

const txt = () => {
  if (cookies.get('login')) return 'Log out'
  else return 'Log in'
}

const handleLoginBtn = props => {
  if (cookies.get('login')) {
      cookies.remove('login')
      cookies.remove('tasks')
      cookies.remove('user')
      cookies.remove('start')
      window.location.reload()
  }

  else if (props.screen === 2) props.setTaskScreen()
  else props.setLoginScreen()
  
}

const LoginBar = (screen, setTaskScreen, setLoginScreen, setRegisterScreen) => {
    return (
      <div className='login-bar'>
          <img className='login-img' src={login} alt='login' />
          {signBtn(screen)}
          <div className='log' onClick={ () => handleLoginBtn(screen, setTaskScreen, setLoginScreen)}>{txt()}</div>
      </div>
    )
  }

  export default LoginBar