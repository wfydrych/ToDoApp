import React, {Component, Fragment} from 'react'
import Cookies from 'universal-cookie'
import login from './img/log.png'
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
        priority: 1,
        email: '',
        login: '',
        pass: '',
        confPass: '',
    }

    handleLoginBtn = () => {
        if (document.querySelector('.login').style.display === 'block')
        {
            document.querySelector('.login').style.display = 'none'
            document.querySelector('.register').style.display = 'none'
            document.querySelector('.login-first').style.display = 'none'
            document.querySelector('.startpage-mobile').style.display = 'none'
        }

        else {
            document.querySelector('.login').style.display = 'block'
            document.querySelector('.register').style.display = 'none'
            document.querySelector('.login-first').style.display = 'none'
            document.querySelector('.startpage-mobile').style.display = 'none'
        }
        
    }

    handleRegisterBtn = () => {
        document.querySelector('.login').style.display = 'none'
        document.querySelector('.register').style.display = 'block'
        document.querySelector('.login-first').style.display = 'none'
        document.querySelector('.startpage-mobile').style.display = 'none'
    }

    handleTryBtn = () => {
        document.querySelector('.startpage-mobile').style.display = 'none'
    }

    handleTitleChange = e => {
        this.setState({
            title: e.target.value
        })
    }

    handleDateChange = e => {
        this.setState({
            date: e.target.value
        })
    }

    handlePriorityChange = props => {
        document.querySelector('.priorityCircleGrey').style.backgroundColor = 'rgba(0,0,0,0)'
        document.querySelector('.priorityCircleBlue').style.backgroundColor = 'rgba(0,0,0,0)'
        document.querySelector('.priorityCircleRed').style.backgroundColor = 'rgba(0,0,0,0)'
        if (props === 1) document.querySelector('.priorityCircleGrey').style.backgroundColor = '#8D8D8D'
        else if (props === 2) document.querySelector('.priorityCircleBlue').style.backgroundColor = '#4D57FF'
        else if (props === 3) document.querySelector('.priorityCircleRed').style.backgroundColor = '#FF5E5A'

        this.setState({
            priority: props
        })
    }

    handleEmailChange = e => {
        this.setState({
            email: e.target.value
        })
    }

    handleLoginChange = e => {
        this.setState({
            login: e.target.login
        })
    }

    handlePassChange = e => {
        this.setState({
            pass: e.target.value
        })
    }

    handlePassRepeatChange = e => {
        this.setState({
            confPass: e.target.value
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
        if (data.title < 3) txt.innerHTML = 'Task must have at least 3 letters!'

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
                        txt.innerHTML = 'Task with such name already exists!'
                        taskExist = true
                        }   
                    })
                    if (taskExist === false) {
                        tasks.push(data)
                        cookies.set('tasks', tasks)
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

    handleLogin = async e => {
        const email = this.state.email
        const pass = this.state.pass
        const errField = document.querySelector('.logErr')
        const errFField = document.querySelector('.firstLogErr')
    
        if (email.length < 6) {
            errField.innerText = 'Too short email!'
            errFField.innerText = 'Too short email!'
        }

        else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            errField.innerText = 'Incorrect email!'
            errFField.innerText = 'Incorrect email!'
        }
    
        else if (!pass.match(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/)) {
            errField.innerText = 'Incorrect password'
            errFField.innerText = 'Incorrect password'
        }
    
        else {
            this.setState({
                email: '',
                pass: '',
        })
            errField.innerText = ''
            errFField.innerText = ''

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, pass }),
            })
    
            let answer = await response.text()
            // answer = JSON.parse(answer)
            errField.innerText = answer.info
            cookies.set('user', answer.user)
            if (answer.tasks) cookies.set('tasks', answer.tasks)
            // window.location.reload(false)
        }
    }

    handleRegister = async e => {
        const email = this.state.email
        const login = this.state.login
        const pass = this.state.pass
        const confPass = this.state.confPass
        const errField = document.querySelector('.regErr')
    
        if (email.length < 6) errField.innerText = 'Too short email!'

        else if (login.length < 6) errField.innerText = 'Too short login!'

        else if (pass !== confPass) errField.innerText = 'Passwords are not the same!'

        else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) errField.innerText = 'Incorrect email!'
    
        else if (!pass.match(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/)) errField.innerText = 'Incorrect password!'
    
        else {
            this.setState({
                email: '',
                login: '',
                pass: '',
                confPass: '',
            })
            errField.innetText = ''
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, login, pass }),
            })
            const answer = await response.text();
            errField.innerText = answer
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
    }
    
    render () {
    return (
        <Fragment>
            <div className='login-bar' onClick={this.handleLoginBtn}>
                <img className='login-img' src={login} alt='login' />
                <div className='log'>Log in</div>
            </div>
            <div className='taskAddPanel'>
                <div className='userHeader'>Hey!</div>
                <span className='newTaskHeader' onClick={this.addTaskMobileForm}>Add new task</span>
                <div className='newTaskForm'>
                    <input value={this.state.title} onChange={this.handleTitleChange} placeholder='title' type='text' />
                    <input value={this.state.date} onChange={this.handleDateChange} placeholder='date' type='date' />
                    <div className='priorityChoose'>
                    <span>Priority:</span>
                        <span className='priorityOption' onClick={this.handlePriorityChange.bind(this, 1)}><span className='priorityCircleGrey'></span>Low</span>
                        <span className='priorityOption' onClick={this.handlePriorityChange.bind(this, 2)}><span className='priorityCircleBlue'></span>Medium</span>
                        <span className='priorityOption' onClick={this.handlePriorityChange.bind(this, 3)}><span className='priorityCircleRed'></span>High</span>
                    </div>
                    <img className='addTask' onClick={this.handleSubmit} src={add} alt='add'/>
                    <span className='addErr'></span>
                </div>
                <div className='login'>
                    <span className='login-title'>Welcome back.</span>
                    <span className='login-subtitle'>It is really nice to see you again!</span>
                    <input className='login-input' value={this.state.email} onChange={this.handleEmailChange} placeholder='email' type='text' />
                    <input className='login-input' value={this.state.pass} onChange={this.handlePassChange} placeholder='password' type='password' />
                    <button className='login-button' onClick={this.handleLogin}>Login</button>
                    <span className='login-create'>Don’t have an account? <br/><strong onClick={this.handleRegisterBtn}>Create Account</strong></span>
                    <span className='logErr'></span>
                    <span className='login-dot'></span>
                </div>
                <div className='register'>
                    <span className='login-title'>Join us!</span>
                    <span className='login-subtitle'>Take control over your tasks!</span>
                    <input className='login-input' value={this.state.email} onChange={this.handleEmailChange} placeholder='email' type='text' />
                    <input className='login-input' value={this.state.login} onChange={this.handleLoginChange} placeholder='login' type='text' />
                    <input className='login-input' value={this.state.pass} onChange={this.handlePassChange} placeholder='password' type='password' />
                    <input className='login-input' value={this.state.confPass} onChange={this.handlePassRepeatChange} placeholder='confirm password' type='password' />
                    <button className='login-button' onClick={this.handleRegister}>Register</button>
                    <span className='regErr'></span>
                    <span className='login-dot'></span>
                    <span className='register-hint'>
                        Password must be at least:<br/>
                        - 8 characters long<br/>
                        - 1 lowercase letter<br/>
                        - 1 capital letter<br/>
                        - 1 number<br/>
                        - 1 special character<br/>
                    </span>
                </div>
                <div className='login-first'>
                    <span className='login-title'>Nice to meet you!</span>
                    <span className='login-subtitle'>We are glad that you have become our new user!</span>
                    <span className='login-subtitle'><strong>Log in</strong> and create your first task</span>
                    <input className='login-input' value={this.state.email} onChange={this.handleEmailChange} placeholder='email' type='text' />
                    <input className='login-input' value={this.state.pass} onChange={this.handlePassChange} placeholder='password' type='password' />
                    <button className='login-button' onClick={this.handleLogin}>Login</button>
                    <span className='firstLogErr'></span>
                </div>
            </div>
            <div className='startpage-mobile'>
                <div className='bgc-dots'>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className='login-bar'>
                    <img className='login-img' src={login} alt='login' />
                    <div className='log'>To<span>Do</span>App</div>
                </div>
                <span className='login-title'>Welcome!</span>
                <span className='login-subtitle'>Take control over your tasks!</span>
                <button className='login-button' onClick={this.handleTryBtn}>Try without account</button>
                <button className='login-button' onClick={this.handleLoginBtn}>Log in</button>
                <button className='login-button' onClick={this.handleRegisterBtn}>Sign in</button>
            </div>
        </Fragment>
    )}
}

export default TaskAdd