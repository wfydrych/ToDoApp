import React from 'react'
import Cookies from 'universal-cookie'
import login from './img/log.png'
import './Intro.sass'

const cookies = new Cookies()

const Intro = props => {
  if (cookies.get('start')) return null

  else return (
    <div className='main'>
      <div className='dots'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
      </div>
      <div className='bar'>
          <img className='bar__login-img' src={login} alt='login' />
          <div className='bar__log'>APP<span>riority</span></div>
      </div>
      <div className='info'>
        <span className='info__title'>Get your stuff done.</span>
        <span className='info__description'>The only <strong>To-Do</strong> application you need!<br />
        With <span className='info__description__namestart'>APP</span>
        <span className='info__description__nameend'>riority </span>
        you can keep your tasks <strong>organized</strong>:<br /><br />
        <strong>Sorting</strong> by date<br />
        Set the <strong>priority</strong><br />
        <strong>Easy</strong> interface<br />
        Access from <strong>all devices</strong></span>
      </div>
      <button className='startButton' onClick={ () => window.matchMedia('(max-width: 1023px)') ? props.setStartScreen() : props.setTaskScreen()}>Start!</button>
    </div>
  )
}

export default Intro