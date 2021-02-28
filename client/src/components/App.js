import React, {Fragment} from 'react'
import './App.sass'
import TaskAdd from './TaskAdd'
import TaskList from './TaskList'
import Footer from './Footer'

export default function App() {
  
  return (
    <Fragment>
      <div className='container'>
        <TaskAdd />
        <TaskList />
        <Footer />
      </div>
    </Fragment>
  )
}