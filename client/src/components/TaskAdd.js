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

    handleBtn = () => {
        if (cookies.get('login')) return 'Log out'
        else return 'Log in'
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

    handleLoginBtn = () => {
        if (cookies.get('login')) {
            cookies.remove('login')
            cookies.remove('tasks')
            cookies.remove('user')
            cookies.remove('start')
            window.location.reload()
        }

        else if (document.querySelector('.login').style.display === 'block')
        {
            document.querySelector('.login').style.display = 'none'
            document.querySelector('.register').style.display = 'none'
            document.querySelector('.login-first').style.display = 'none'
            document.querySelector('.startpage-mobile').style.display = 'none'
            document.querySelector('.forgot-pass').style.display = 'none'
        }

        else {
            document.querySelector('.login').style.display = 'block'
            document.querySelector('.register').style.display = 'none'
            document.querySelector('.login-first').style.display = 'none'
            document.querySelector('.startpage-mobile').style.display = 'none'
            document.querySelector('.forgot-pass').style.display = 'none'
        }
        
    }

    handleRegisterBtn = () => {
        document.querySelector('.login').style.display = 'none'
        document.querySelector('.register').style.display = 'block'
        document.querySelector('.login-first').style.display = 'none'
        document.querySelector('.startpage-mobile').style.display = 'none'
        document.querySelector('.forgot-pass').style.display = 'none'
    }

    handleForgotBtn = () => {
        document.querySelector('.login').style.display = 'none'
        document.querySelector('.register').style.display = 'none'
        document.querySelector('.login-first').style.display = 'none'
        document.querySelector('.startpage-mobile').style.display = 'none'
        document.querySelector('.forgot-pass').style.display = 'block'
    }

    handleTryBtn = () => {
        document.querySelector('.startpage-mobile').style.display = 'none'
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

    handleEmailChange = e => {
        this.setState({
            email: e.target.value
        })
    }

    handleLoginChange = e => {
        this.setState({
            login: e.target.value
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
    
        // else if (!pass.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)) {
            else if (!true) {
            errField.innerText = 'Incorrect password'
            errFField.innerText = 'Incorrect password'
        }
    
        else {
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
            answer = JSON.parse(answer)
            errField.innerText = answer.info
            cookies.set('login', answer.login)
            cookies.set('user', answer.user)

            this.setState({
                email: '',
                pass: '',
            })
            
            if (answer.tasks) cookies.set('tasks', answer.tasks)
            window.location.reload(false)
        }
    }

    handleRegister = async e => {
        const email = this.state.email
        const login = this.state.login
        const pass = this.state.pass
        const confPass = this.state.confPass
        const errField = document.querySelector('.regErr')
    
        if (email.length < 6) errField.innerText = 'Too short email!'

        else if (login.length < 3) errField.innerText = 'Too short login!'

        else if (pass !== confPass) errField.innerText = 'Passwords are not the same!'

        else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) errField.innerText = 'Incorrect email!'
    
        else if (!pass.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)) errField.innerText = 'Incorrect password!'
    
        else {
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

            this.setState({
                email: '',
                login: '',
                pass: '',
                confPass: '',
            })

            document.querySelector('.register').style.display = 'none'
            document.querySelector('.login-first').style.display = 'block'
        }
    }   

    handleSendForgot = () => {
        const err = document.querySelector('.forgotErr')
        const email = this.state.email
        if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) err.innerText = 'Incorrect email!'
        else {
            this.setState({
                email: ''
            })
            err.innerText = 'Password sent!'

            const response = fetch('/forgot', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
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
        const x = window.matchMedia('(max-width: 1023px)')
        if (x.matches) {
            if (cookies.get('start')) document.querySelector('.startpage-mobile').style.display = 'none'
            else cookies.set('start', true)
        }
        else if (cookies.get('start')) document.querySelector('.newTaskForm').style.display = 'block'
    }

    welcome = () => {
        if (cookies.get('login')) return 'Hey ' + cookies.get('login') + '!'
        else return 'Hey!'
    }

    signBtn = () => {
        const x = window.matchMedia('(max-width: 1023px)')
        if (x.matches) return ''
        else if (cookies.get('login')) return ''
        else return <div className="log" onClick={this.handleRegisterBtn}>Sign up</div>
    }
    
    render () {
    return (
        <Fragment>
            <div className='login-bar'>
                <img className='login-img' src={login} alt='login' />
                {this.signBtn()}
                <div className='log' onClick={this.handleLoginBtn}>{this.handleBtn()}</div>
            </div>
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
                <div className='login'>
                    <span className='login-title'>Welcome back.</span>
                    <span className='login-subtitle'>It is really nice to see you again!</span>
                    <input className='login-input' value={this.state.email} onChange={this.handleEmailChange} placeholder='email' type='text' />
                    <input className='login-input' value={this.state.pass} onChange={this.handlePassChange} placeholder='password' type='password' />
                    <button className='login-button' onClick={this.handleLogin}>Login</button>
                    <span className='login-create' onClick={this.handleForgotBtn}><strong>Forgot password?</strong><br/></span>
                    <span className='login-create'>Don’t have an account? <br/><strong onClick={this.handleRegisterBtn}>Create Account</strong></span>
                    <span className='logErr'></span>
                    <span className='login-dot'></span>
                </div>
                <div className='register'>
                    <span className='login-title'>Join us!</span>
                    <span className='login-subtitle'>Take control over your tasks.</span>
                    <input className='login-input' value={this.state.email} onChange={this.handleEmailChange} placeholder='email' type='text' />
                    <input className='login-input' value={this.state.login} onChange={this.handleLoginChange} placeholder='login' type='text' />
                    <input className='login-input' value={this.state.pass} onChange={this.handlePassChange} placeholder='password' type='password' />
                    <input className='login-input' value={this.state.confPass} onChange={this.handlePassRepeatChange} placeholder='confirm password' type='password' />
                    <button className='login-button' onClick={this.handleRegister}>Register</button>
                    <span className='regErr'></span>
                    <span className='login-dot'></span>
                    <span className='register-hint'>
                        Password must have at least:<br/>
                        - 1 letter<br/>
                        - 1 number<br/>
                        - 6 signs<br/>
                    </span>
                </div>
                <div className='login-first'>
                    <span className='login-title'>Nice to meet you!</span>
                    <span className='login-subtitle'>We are glad to have a new user :)</span>
                    <span className='login-subtitle'><strong>Log in</strong> and create your first task</span>
                    <input className='login-input' value={this.state.email} onChange={this.handleEmailChange} placeholder='email' type='text' />
                    <input className='login-input' value={this.state.pass} onChange={this.handlePassChange} placeholder='password' type='password' />
                    <button className='login-button' onClick={this.handleLogin}>Login</button>
                    <span className='firstLogErr'></span>
                </div>
                <div className='forgot-pass'>
                    <span className='login-title'>Forgot password?</span>
                    <input className='login-input' value={this.state.email} onChange={this.handleEmailChange} placeholder='email' type='text' />
                    <button className='login-button' onClick={this.handleSendForgot}>Send</button>
                    <span className='forgotErr'></span>
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
                <span className='login-subtitle'>Take control over your tasks.</span>
                <button className='login-button' onClick={this.handleTryBtn}>Try without account</button>
                <button className='login-button' onClick={this.handleLoginBtn}>Log in</button>
                <button className='login-button' onClick={this.handleRegisterBtn}>Sign in</button>
            </div>
        </Fragment>
    )}
}

export default TaskAdd