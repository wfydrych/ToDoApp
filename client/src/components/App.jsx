import React from 'react'
import './App.sass'
import TaskAdd from './TaskAdd'
import TaskList from './TaskList'
import Footer from './Footer'

const App = () => {
  return (
    <div className='container'>
      <TaskAdd />
      <TaskList />
      <Footer />
    </div>
  )
}

export default App
