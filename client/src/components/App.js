import React, {Component} from 'react'
import './App.sass'
import TaskAdd from './TaskAdd'
import TaskList from './TaskList'

class App extends Component {
  state = {}
  
  render() {
  return (
    <div className='body'>
      <TaskAdd></TaskAdd>
      <TaskList></TaskList>
    </div>
  )}
}

export default App;
