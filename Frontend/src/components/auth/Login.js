import React, { useState } from 'react'
import styles from '../../css/login.module.css'
import {Link, Navigate} from 'react-router-dom'
import { API_URL } from '../../config'
import {useAuth} from '../../context/AuthContext'

export default function Login() {  
  const [status, setStatus] = useState(null)
  const {setAuth, auth} = useAuth() 

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let data = {
        email: e.target.email.value,
        password: e.target.password.value,
      }
  
      let res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let resData = await res.json()
      if(resData.error) throw resData.error
      resData.user.enrolledCourses= new Set(resData.user.enrolledCourses)

      console.log(resData)
      setStatus({text:resData.message})
      setAuth({
        token: resData.token,
        user: resData.user
      })
      // remember-me
      window.localStorage.setItem('_token', resData.token)
    } catch (error) {
      setStatus({error: true, text: error})
    }
  }

  if(auth) return <Navigate to='/' />

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>
        <p>LMS login for continue</p>
         <input type='email' name='email' placeholder='Username' />
         <input type='password' name='password' placeholder='Password' />
         <div className={'status' + (status?.error ? '':' success')}>{status?.text}</div>
         <input type='submit' value={'Sign In'}/>
        <div >
            <hr/>
            <span>OR</span>
            <hr/>
        </div>
         <Link to={'/register'}>
            <button style={{background: '#f0f0f0', color: 'black'}}>
                Sign Up
            </button>
         </Link>
      </form>
    </div>
  )
}
