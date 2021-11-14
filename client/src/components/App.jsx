import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import './App.sass'
import TaskAdd from './TaskAdd'
import TaskList from './TaskList'
import LoginBar from './LoginBar'
import Login from './Login'
import LoginFirst from './LoginFirst'
import Register from './Register'
import StartMobile from './StartMobile'
import ForgotPass from './ForgotPass'
import Footer from './Footer'

const cookies = new Cookies()

const startScreen = () => {
  const x = window.matchMedia('(max-width: 1023px)')
  console.log(cookies.get('start'))
  if (x.matches) {
      if (cookies.get('start')) return 4
      else {
        return 0
      }
  }
  else if (cookies.get('start')) return 4
  else {
    cookies.set('start', true)
    return 4
  }
}

const App = () => {
  const [screen, setScreen] = useState(startScreen)
  // 0 - StartMobile, 1 - Register, 2 - Login, 3 - LoginFirst, 4 - Task, 5 - ForgotPass

  const setRegisterScreen = () => {
    setScreen(1)
  }

  const setLoginScreen = () => {
    setScreen(2)
  }

  const setTaskScreen = () => {
    setScreen(4)
  }

  const setForgotScreen = () => {
    setScreen(5)
  }

  return (
    <div className='container'>
      { screen !== 0 && <LoginBar screen={screen} setTaskScreen={setTaskScreen} setLoginScreen={setLoginScreen} setRegisterScreen={setRegisterScreen}/> }
      { screen === 0 && <StartMobile setTaskScreen={setTaskScreen} setLoginScreen={setLoginScreen} setRegisterScreen={setRegisterScreen} /> }
      { screen === 1 && <Register setTaskScreen={setTaskScreen} /> }
      { screen === 2 && <Login setRegisterScreen={setRegisterScreen} setForgotScreen={setForgotScreen} setTaskScreen={setTaskScreen} /> }
      { screen === 3 && <LoginFirst /> }
      <TaskAdd />
      <TaskList />
      { screen === 5 && <ForgotPass setTaskScreen={setTaskScreen} /> }
      <Footer />
    </div>
  )
}

export default App
