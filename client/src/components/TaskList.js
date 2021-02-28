import React, {Component, Fragment} from 'react'
import Cookies from 'universal-cookie'
import './TaskList.sass'
import notasks from './img/cat.svg'
import logo from './img/logo.png'

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
                if (task.done === true) task.done = false
                else task.done = true
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
    
    choosePrior = task => {
        if ((task.priority === 1) && (task.done === true)) return 'priorityCircleGreyDone'
        else if ((task.priority === 1) && (task.done === false)) return 'priorityCircleGrey'
        else if ((task.priority === 2) && (task.done === true)) return 'priorityCircleBlueDone'
        else if ((task.priority === 2) && (task.done === false)) return 'priorityCircleBlue'
        else if ((task.priority === 3) && (task.done === true)) return 'priorityCircleRedDone'
        else return 'priorityCircleRed'
    }
    
    createDate = date => {
        const day = new Date(date).getDate()
        let month = new Date(date).getMonth()

        switch (month) {
            case 0:
                month = 'Jan'
                break;
            case 1:
                month = 'Feb'
                break;
            case 2:
                month = 'Mar'
                break;
            case 3:
                month = 'Apr'
                break;
            case 4:
                month = 'May'
                break;
            case 5:
                month = 'Jun'
                break;
            case 6:
                month = 'Jul'
                break;
            case 7:
                month = 'Aug'
                break;
            case 8:
                month = 'Sep'
                break;
            case 9:
                month = 'Oct'
                break;
            case 10:
                month = 'Nov'
                break;
            case 11:
                month = 'Dec'
                break;
        }

        return day + ' ' + month
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
        if (tasks.length === 0) return <Fragment><img src={notasks} alt='no-tasks' className='noTasks' /> <span class='noTasks__txt'>No tasks added yet</span></Fragment>
    
        else 
        {
            let tasksToDo = tasks.filter(task => !task.done)
            tasksToDo = tasksToDo.sort(function(a,b) {
                let t1 = new Date(a.date).getTime()
                let t2 = new Date(b.date).getTime()
                return t1-t2
            })

            let tasksDone = tasks.filter(task => task.done)
            tasksDone = tasksDone.sort(function(a,b) {
                let t1 = new Date(a.date).getTime()
                let t2 = new Date(b.date).getTime()
                return t1-t2
            })
    
            tasksToDo = tasksToDo.map(task => 
                <Fragment key={task.title}>
                    <div className='taskListToDo'>
                        <span className={this.choosePrior(task)}></span>
                        <span onClick={this.handleTask.bind(this, task.title)} className='taskName'>{task.title} </span><span className='taskDate'>{this.createDate(task.date)}</span>
                    </div>
                </Fragment>
            )

            tasksDone = tasksDone.map(task => 
                <Fragment key={task.title}>
                    <div className='taskListDone'>
                        <span className={this.choosePrior(task)}></span>
                        <span onClick={this.handleTask.bind(this, task.title)} className='taskName'>{task.title} </span><span className='taskDate'>{this.createDate(task.date)}</span>
                    </div>
                </Fragment>
            )

            tasks = [tasksToDo, tasksDone]

            return tasks
        }
    }

    render() {
        return (
            <Fragment>
                <div className='taskListPanel'>
                    <img src={logo} alt='logo-img' className='logoImg' />
                    <span className='taskListHeader'>These are your current tasks: </span>
                    <div className='tasksListMobile'>{this.createTaskList()}</div>
                </div>
                <div className='taskMenu'>
                    <div className='taskMenu__option' onClick={this.taskDone}>Done</div>
                    <div className='taskMenu__option' onClick={this.taskDelete}>Delete</div>
                    <div className='taskMenu__option' onClick={this.taskClose}>Cancel </div>
                </div>
            </Fragment>
        )
    }
}

export default TaskList