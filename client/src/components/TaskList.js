import React, {Component, Fragment} from 'react'
import Cookies from 'universal-cookie'
import './TaskList.sass'
import notasks from './img/logo.png'

const cookies = new Cookies()

class TaskList extends Component {
    state = {
        task: ''
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

    taskDone = () => {
        let tasks = cookies.get('tasks')
        tasks.map(task => {
            if (task.title === this.state.task) {
                task.done = true
                cookies.set('tasks', tasks)
                this.updateDatabase(tasks)
            }
        })
        window.location.reload()
    }
    
    taskDelete = () => {
        let tasks = cookies.get('tasks')
        tasks = tasks.filter(task => 
          task.title !== this.state.task
        )
        cookies.set('tasks', tasks)
        this.updateDatabase(tasks)
        window.location.reload()
    }
    
    choosePrior = prior => {
        if (prior === 1) return 'priorityCircleGrey'
        else if (prior === 2) return 'priorityCircleBlue'
        else return 'priorityCircleRed'
    }
    
    createDate = date => {
        const day = new Date(date).getDate()
        const month = new Date(date).getMonth()
        const year = new Date(date).getFullYear()
        return day + '/' + (month+1) + '/' + year
    }
    
    handleTask = props => {
        document.querySelector('.taskMenu').style.display = 'block'
        this.setState({
            task: props
        })
    }
    
    taskClose = () => {
        document.querySelector('.taskMenu').style.display = 'none'
    }

    createTaskList = () => {
        let tasks = cookies.get('tasks') || []
        if (tasks.length === 0) return <img src={notasks} alt='no-tasks' className='noTasks' />
    
        else 
        {
            tasks = tasks.sort(function(a,b) {
                let t1 = new Date(a.date).getTime()
                let t2 = new Date(b.date).getTime()
                return t1-t2
            })
    
            tasks = tasks.map(task => 
                <Fragment key={task.title}>
                    <div className={task.done ? 'taskListDone': 'taskListToDo'}>
                        <span className={this.choosePrior(task.priority)}></span>
                        <span onClick={this.handleTask.bind(this, task.title)} className='taskName'>{task.title} </span><span className='taskDate'>{this.createDate(task.date)}</span>
                    </div>
                </Fragment>
            )
            return tasks
        }
    }

    render() {
        return (
            <Fragment>
                <div className='taskListPanel'>
                    <span className='taskListHeader'>These are your current tasks: </span>
                    <div className='tasksListMobile'>{this.createTaskList()}</div>
                </div>
                <div className='taskMenu'>
                    <div className='taskOpt' onClick={this.taskDone}>Done</div>
                    <div className='taskOpt' onClick={this.taskDelete}>Delete</div>
                    <div className='taskOpt' onClick={this.taskClose}>Cancel </div>
                </div>
            </Fragment>
        )
    }
}

export default TaskList