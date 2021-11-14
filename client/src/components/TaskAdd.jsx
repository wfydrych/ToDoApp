import React, {Component, Fragment} from 'react'
import Cookies from 'universal-cookie'
import add from './img/add.png'
import './TaskAdd.sass'

const cookies = new Cookies()

class TaskAdd extends Component {

    getDate = () => {
        const time = new Date()
        let date = time.getFullYear() + '-'
        if (time.getMonth() < 10) date += '0'
        date += time.getMonth() +1
        date += '-'
        if (time.getDate() < 10) date += '0'
        date += time.getDate()
        return date
    }

    state = {
        title: '',
        date: this.getDate(),
        priority: 1
    }

    updateDatabase = props => {
        const tasks = props
        const response = fetch('/updatetask', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({tasks: tasks, user: cookies.get('user')}),
        })
      }

    handleTitleChange = e => {
        this.setState({
            title: e.target.value
        })

        document.querySelector('.addErr').innerHTML = ''
    }

    handleDateChange = e => {
        this.setState({
            date: e.target.value
        })

        document.querySelector('.addErr').innerHTML = ''
    }

    handlePriorityChange = props => {
        document.querySelector('.priorityCircleGrey').style.backgroundColor = 'rgba(0,0,0,0)'
        document.querySelector('.priorityCircleBlue').style.backgroundColor = 'rgba(0,0,0,0)'
        document.querySelector('.priorityCircleRed').style.backgroundColor = 'rgba(0,0,0,0)'
        if (props === 1) document.querySelector('.priorityCircleGrey').style.backgroundColor = '#8D8D8D'
        else if (props === 2) document.querySelector('.priorityCircleBlue').style.backgroundColor = '#fca503'
        else if (props === 3) document.querySelector('.priorityCircleRed').style.backgroundColor = '#FF5E5A'

        this.setState({
            priority: props
        })
    }

    handleSubmit = () => {
        const data = {
            title: this.state.title, 
            date: this.state.date, 
            priority: this.state.priority,
            done: false
        }

        const txt = document.querySelector('.addErr')
        txt.innerHTML = ''
        if (data.title < 3) txt.innerHTML = 'Title must have at least 3 letters!'

        else {
            const t1 = new Date().getTime()
            const t2 = new Date(data.date).getTime()
            const t3 = t2-t1 + 86400000
            if (t3 < 0) txt.innerHTML = 'Date cannot be from the past!'

            else {
                let tasks = cookies.get('tasks') || []
                let taskExist = false
                tasks.map(task => {
                    if (task.title === data.title) {
                        txt.innerHTML = 'Task with such title already exists!'
                        taskExist = true
                        }   
                    })
                    if (taskExist === false) {
                        tasks.push(data)
                        cookies.set('tasks', tasks)
                        this.updateDatabase(tasks)
                        this.setState({
                            name: '',
                            date: this.getDate(),
                        })
                        txt.innerHTML = ''
                        window.location.reload()
                    }
            }
        }
    }

    addTaskMobileForm = () => {
        const x = window.matchMedia('(max-width: 1023px)')
        if (x.matches) {
            if (document.querySelector('.newTaskForm').style.display === 'block')
            document.querySelector('.newTaskForm').style.display = 'none'
            else document.querySelector('.newTaskForm').style.display = 'block'
        }
    }

    componentDidMount() {
        this.handlePriorityChange(this.state.priority)
        if (!(cookies.get('start'))) cookies.set('start', true)
    }

    welcome = () => {
        if (cookies.get('login')) return 'Hey ' + cookies.get('login') + '!'
        else return 'Hey!'
    }
    
    render () {
    return (
        <Fragment>
            <div className='taskAddPanel'>
                <div className='userHeader'>{this.welcome()}</div>
                <span className='newTaskHeader' onClick={this.addTaskMobileForm}>Add new task</span>
                <div className='newTaskForm'>
                    <input value={this.state.title} onChange={this.handleTitleChange} placeholder='title' type='text' />
                    <input value={this.state.date} onChange={this.handleDateChange} placeholder='date' type='date' />
                    <div className='priorityChoose'>
                    <span>Priority:</span>
                        <span className='priorityChoose__option' onClick={this.handlePriorityChange.bind(this, 1)}><span className='priorityCircleGrey'></span>Low</span>
                        <span className='priorityChoose__option' onClick={this.handlePriorityChange.bind(this, 2)}><span className='priorityCircleBlue'></span>Medium</span>
                        <span className='priorityChoose__option' onClick={this.handlePriorityChange.bind(this, 3)}><span className='priorityCircleRed'></span>High</span>
                    </div>
                    <img className='addTask' onClick={this.handleSubmit} src={add} alt='add'/>
                    <span className='addErr'></span>
                </div>
            </div>
        </Fragment>
    )}
}

export default TaskAdd