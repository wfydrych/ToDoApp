import React, {Fragment} from 'react'
import Cookies from 'universal-cookie'
import './TaskList.sass'
import done from './img/done.png'
import notasks from './img/logo.png'

const cookies = new Cookies()

const taskDone = props => {
    let tasks = cookies.get('tasks')
    tasks.map(task => {
        if (task.title === props) {
            task.done = true
            cookies.set('tasks', tasks)
        }
    })
    window.location.reload()
}

const taskDelete = props => {
    let tasks = cookies.get('tasks')
    tasks = tasks.filter(task => 
      task.title !== props
    )
    cookies.set('tasks', tasks)
    window.location.reload()
}

const choosePrior = prior => {
    if (prior === 1) return 'priorityCircleGrey'
    else if (prior === 2) return 'priorityCircleBlue'
    else return 'priorityCircleRed'
}

const createDate = date => {
    const day = new Date(date).getDate()
    const month = new Date(date).getMonth()
    const year = new Date(date).getFullYear()
    return day + '/' + (month+1) + '/' + year
}

const createTaskList = () => {
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
                    <span onClick={task.done ? '' : taskDone.bind(this, task.title)} className={choosePrior(task.priority)}></span>
                    <span onClick={taskDelete.bind(this, task.title)} className='taskName'>{task.title} </span><span className='taskDate'>{createDate(task.date)}</span>
                </div>
            </Fragment>
        )
        return tasks
    }
}

const TaskList = () => {
    return (
        <Fragment>
            <div className='taskListPanel'>
                <span className='taskListHeader'>These are your current tasks: </span>
                <div className='tasksListMobile'>{createTaskList()}</div>
            </div>
        </Fragment>
    )
}

export default TaskList