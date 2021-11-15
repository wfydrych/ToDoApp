import React, {Component, Fragment} from 'react'
import {TimelineMax} from 'gsap'
import Cookies from 'universal-cookie'
import './TaskList.sass'
import './Fireworks.css'
import logo from './img/logo.png'

const cookies = new Cookies()

const animation = () => {
    let tasks = cookies.get('tasks') || []
    if (tasks.length === 0) {
        const lefteye = document.querySelector('#lefteye')
        const righteye = document.querySelector('#righteye')
        const tail = document.querySelector('#tail')

        let t1 = new TimelineMax({
            repeat: -1,
            repeatDelay: 3,
        })

        t1
            .add('start')
            .to(lefteye, .1, {opacity: 0})
            .to(righteye, .1, {opacity: 0}, 'start')
            .add('blink')
            .to(lefteye, .1, {opacity: 1})
            .to(righteye, .1, {opacity: 1}, 'blink')
            .set(tail, {transformOrigin: '50% 100%'})
            .to(tail, .5, {rotation: -7})
            .to(tail, .5, {rotation: 14})
            .to(tail, .5, {rotation: 0})

        return null
    }
}

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
        let done = false
        let tasks = cookies.get('tasks')
        tasks.map(task => {
            if (task.title === this.state.task) {
                task.done = !task.done
                done = task.done
                cookies.set('tasks', tasks)
                this.updateDatabase(tasks)
            }
        })

        if (done) {
            this.taskClose()
            document.querySelector('.pyro').style.display = 'block'
            setTimeout(() => { window.location.reload() }, 2000)
        }
        else window.location.reload()
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
        if (props.done) document.querySelector('.taskDoneMenu').style.display = 'block'
        else document.querySelector('.taskMenu').style.display = 'block'
        this.setState({
            task: props.title
        })
    }
    
    taskClose = () => {
        document.querySelector('.taskMenu').style.display = 'none'
        document.querySelector('.taskDoneMenu').style.display = 'none'
    }

    createTaskList = () => {
        let tasks = cookies.get('tasks') || []
        if (tasks.length === 0) {

            const pic = <svg className='noTasks' height="512pt" viewBox="-53 0 512 512.00002" width="512pt" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffae8b">
                <path d="m313.074219 149.273438c-.710938-4.167969-4.664063-6.960938-8.824219-6.257813l-18.949219 3.234375c-4.164062.710938-6.964843 4.660156-6.253906 8.824219.632813 3.730469 3.871094 6.363281 7.527344 6.363281.429687 0 .859375-.035156 1.296875-.109375l18.949218-3.230469c4.164063-.710937 6.964844-4.660156 6.253907-8.824218zm0 0"/>
                <path d="m304.128906 185.011719-18.242187-9.910157c-3.714844-2.015624-8.359375-.640624-10.375 3.070313s-.640625 8.355469 3.070312 10.375l18.246094 9.90625c1.160156.632813 2.410156.929687 3.644531.929687 2.714844 0 5.339844-1.445312 6.726563-4 2.019531-3.710937.644531-8.355468-3.070313-10.371093zm0 0"/>
                <path d="m25.3125 161.328125c.433594.074219.867188.109375 1.292969.109375 3.660156 0 6.898437-2.632812 7.53125-6.363281.710937-4.164063-2.089844-8.113281-6.253907-8.824219l-18.945312-3.234375c-4.164062-.707031-8.117188 2.089844-8.828125 6.257813-.710937 4.164062 2.089844 8.113281 6.253906 8.824218zm0 0"/>
                <path d="m27.296875 175.101562-18.242187 9.910157c-3.714844 2.015625-5.085938 6.660156-3.070313 10.375 1.382813 2.550781 4.011719 3.996093 6.726563 3.996093 1.234374 0 2.484374-.296874 3.644531-.925781l18.246093-9.910156c3.710938-2.019531 5.085938-6.660156 3.070313-10.375-2.019531-3.710937-6.660156-5.085937-10.375-3.070313zm0 0"/>
            </g>
            <path id="tail" d="m328.554688 165.308594c1.335937 26.425781 35.226562 67.464844 31.285156 119.820312-3.523438 46.839844-25.601563 103.726563-70.796875 132.503906.179687 2.585938.277343 4.984376.277343 7.160157 0 28.503906-14.984374 45.230469-45.421874 54.1875.027343-.007813 161.660156-35.203125 161.699218-207.730469.039063-175.988281-78.804687-140.671875-77.042968-105.941406zm0 0" fill="#ffdca7"/>
            <path d="m314.003906 396.679688c-7.371094 7.949218-15.683594 15.039062-24.964844 20.949218.183594 2.585938.28125 4.984375.28125 7.160156 0 28.507813-14.984374 45.234376-45.421874 54.191407 0 0 32.53125-7.085938 68.40625-30.46875 3.039062-6.804688 4.550781-14.667969 4.550781-23.722657 0-7.246093-1.058594-16.917968-2.851563-28.109374zm0 0" fill="#ffcf86"/>
            <path d="m194.800781 51.21875s21.394531-54.824219 39.726563-51.03125c18.589844 3.84375 14.980468 65.691406 14.980468 65.691406s38.398438 58.9375 37.15625 92.839844c-1.242187 33.898438-23.035156 56.511719-44.601562 60.636719 0 0 47.257812 156.882812 47.257812 205.4375 0 48.550781-43.453124 62.941406-132.726562 62.941406-89.277344 0-132.730469-14.390625-132.730469-62.941406 0-48.554688 47.257813-205.4375 47.257813-205.4375-21.5625-4.125-43.359375-26.738281-44.601563-60.636719-1.242187-33.902344 37.15625-92.839844 37.15625-92.839844s-3.609375-61.847656 14.980469-65.691406c18.328125-3.792969 39.726562 51.03125 39.726562 51.03125zm0 0" fill="#ffe9c8"/>
            <path d="m156.59375 460.199219c-81.277344 0-124.566406-11.933594-131.675781-50.703125-.675781 5.820312-1.054688 10.992187-1.054688 15.296875 0 48.550781 43.449219 62.941406 132.726563 62.941406s132.730468-14.394531 132.730468-62.941406c0-4.304688-.378906-9.476563-1.054687-15.296875-7.109375 38.769531-50.398437 50.703125-131.671875 50.703125zm0 0" fill="#ffdca7"/>
            <path d="m78.65625.1875c-18.589844 3.84375-14.980469 65.691406-14.980469 65.691406s-38.398437 58.9375-37.15625 92.839844c.65625 17.925781 7.0625 32.691406 16.140625 43.242188 107.960938-24.144532 98.457032-150.742188 98.457032-150.742188h-22.734376s-21.398437-54.824219-39.726562-51.03125zm0 0" fill="#ffae8b"/>
            <path d="m234.527344.1875c18.585937 3.84375 14.980468 65.691406 14.980468 65.691406s38.398438 58.9375 37.15625 92.839844c-.65625 17.925781-7.0625 32.691406-16.140624 43.242188-107.960938-24.144532-98.460938-150.742188-98.460938-150.742188h22.738281s21.394531-54.824219 39.726563-51.03125zm0 0" fill="#ffae8b"/>
            <path id="lefteye" d="m92.410156 111.300781c-8.707031 0-15.527344 8.46875-15.527344 19.28125s6.820313 19.28125 15.527344 19.28125c8.703125 0 15.523438-8.46875 15.523438-19.28125s-6.820313-19.28125-15.523438-19.28125zm0 0" fill="#433f43"/>
            <path id="righteye" d="m220.773438 111.300781c-8.703126 0-15.523438 8.46875-15.523438 19.28125s6.820312 19.28125 15.523438 19.28125c8.707031 0 15.527343-8.46875 15.527343-19.28125s-6.820312-19.28125-15.527343-19.28125zm0 0" fill="#433f43"/>
            <path d="m180.089844 148.078125c0-2.664063-1.027344-9.105469-10.527344-11.355469-3.121094-.738281-7-1.054687-12.96875-1.054687-5.976562 0-9.851562.316406-12.96875 1.054687-9.503906 2.25-10.53125 8.691406-10.53125 11.355469 0 7.273437 6.917969 14.035156 15.851562 16.597656v17.148438c0 4.222656 3.421876 7.648437 7.648438 7.648437 4.222656 0 7.648438-3.425781 7.648438-7.648437v-17.148438c8.929687-2.5625 15.847656-9.324219 15.847656-16.597656zm0 0" fill="#dd8858"/>
            <path d="m76.039062 306.507812s7.457032 197.84375 35.929688 197.84375 29.148438-178.359374 29.148438-178.359374" fill="#ffe9c8"/>
            <path d="m237.144531 306.507812s-7.457031 197.84375-35.929687 197.84375-29.152344-178.359374-29.152344-178.359374" fill="#ffe9c8"/>
            <path d="m111.96875 512c-13.949219 0-20.710938-19.605469-25.039062-36.683594-4.25-16.75-8.019532-39.984375-11.207032-69.054687-5.390625-49.164063-7.308594-98.96875-7.328125-99.46875-.160156-4.21875 3.132813-7.769531 7.355469-7.929688 4.21875-.183593 7.773438 3.132813 7.933594 7.355469.015625.460938 1.792968 46.570312 6.726562 93.53125 2.878906 27.410156 6.25 49.707031 10.019532 66.269531 5.445312 23.933594 10.253906 29.382813 11.632812 30.5 2.074219-1.539062 12.097656-12.695312 17.882812-86.273437 3.328126-42.328125 3.523438-83.867188 3.523438-84.285156.015625-4.214844 3.4375-7.617188 7.648438-7.617188h.03125c4.222656.015625 7.632812 3.453125 7.617187 7.675781 0 .449219-.210937 45.410157-3.921875 89.789063-2.199219 26.28125-5.1875 47.304687-8.878906 62.480468-3.519532 14.472657-9.835938 33.710938-23.996094 33.710938zm0 0" fill="#ffdca7"/>
            <path d="m201.214844 512c-14.160156 0-20.476563-19.238281-24-33.707031-3.691406-15.179688-6.675782-36.199219-8.875-62.484375-3.710938-44.378906-3.921875-89.339844-3.925782-89.789063-.015624-4.222656 3.394532-7.660156 7.621094-7.675781h.027344c4.210938 0 7.632812 3.402344 7.648438 7.621094.003906.414062.199218 42.027344 3.53125 84.355468 5.785156 73.511719 15.804687 84.660157 17.878906 86.203126 1.378906-1.121094 6.1875-6.566407 11.632812-30.503907 3.769532-16.558593 7.140625-38.855469 10.019532-66.269531 4.933593-46.960938 6.710937-93.070312 6.726562-93.53125.160156-4.222656 3.742188-7.53125 7.933594-7.355469 4.21875.160157 7.511718 3.710938 7.355468 7.933594-.019531.496094-1.9375 50.300781-7.328124 99.46875-3.1875 29.066406-6.957032 52.300781-11.207032 69.054687-4.328125 17.074219-11.089844 36.679688-25.039062 36.679688zm0 0" fill="#ffdca7"/>
        </svg>

            return (
                <Fragment>
                    {pic}
                    <span className='noTasks__txt'>No tasks added yet</span>
                </Fragment>
            )
        }
    
        else
        {
            let tasksToDo = tasks.filter(task => !task.done)
            tasksToDo = tasksToDo.sort(function(a,b) {
                const t1 = new Date(a.date).getTime()
                const t2 = new Date(b.date).getTime()
                return t1-t2
            })

            let tasksDone = tasks.filter(task => task.done)
            tasksDone = tasksDone.sort(function(a,b) {
                const t1 = new Date(a.date).getTime()
                const t2 = new Date(b.date).getTime()
                return t1-t2
            })
    
            tasksToDo = tasksToDo.map(task => 
                <Fragment key={task.title}>
                    <div className='taskListToDo'>
                        <span className={this.choosePrior(task)}></span>
                        <span onClick={this.handleTask.bind(this, task)} className='taskName'>{task.title} </span><span className='taskDate'>{this.createDate(task.date)}</span>
                    </div>
                </Fragment>
            )

            tasksDone = tasksDone.map(task => 
                <Fragment key={task.title}>
                    <div className='taskListDone'>
                        <span className={this.choosePrior(task)}></span>
                        <span onClick={this.handleTask.bind(this, task)} className='taskName'>{task.title} </span><span className='taskDate'>{this.createDate(task.date)}</span>
                    </div>
                </Fragment>
            )

            tasks = [tasksToDo, tasksDone]

            return tasks
        }
    }

    componentDidMount() {
        animation()
        document.querySelector('.pyro').style.display = 'none'
    }

    render() {
        return (
            <>
                <div className='taskListPanel'>
                    <img src={logo} alt='logo-img' className='logoImg' />
                    <span className='taskListHeader'>Your current tasks: </span>
                    <div className='tasksListMobile'>{this.createTaskList()}</div>
                </div>
                <div className='taskMenu'>
                    <div className='taskMenu__option' onClick={this.taskDone}>Done</div>
                    <div className='taskMenu__option' onClick={this.taskDelete}>Delete</div>
                    <div className='taskMenu__option' onClick={this.taskClose}>Cancel </div>
                </div>
                <div className='taskDoneMenu'>
                    <div className='taskMenu__option undo' onClick={this.taskDone}>Undo</div>
                    <div className='taskMenu__option' onClick={this.taskDelete}>Delete</div>
                    <div className='taskMenu__option' onClick={this.taskClose}>Cancel </div>
                </div>
                <div className="pyro">
                    <div className="before"></div>
                    <div className="after"></div>
                </div>
            </>
        )
    }
}

export default TaskList