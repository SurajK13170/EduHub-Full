import React, { useState } from 'react'
import styles from '../../css/login.module.css'
import {Link, Navigate} from 'react-router-dom'
import {API_URL} from '../../config'
import { useAuth } from '../../context/AuthContext'

export default function Register() {  
  const [status, setStatus] = useState(null) 
  const {setAuth, auth} = useAuth() 
  
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let data = {
        name: e.target.name.value,
        age: e.target.age.value,
        email: e.target.email.value,
        password: e.target.password.value,
      }
  
      let res = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let resData = await res.json()
      if(resData.error) throw resData.error
      e.target.reset()
      setStatus({text: 'Registered successfully'})
    } catch (error) {
      setStatus({error: true, text: error})
    }
  }

  if(auth) return <Navigate to='/' />

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Register</h2>
        <p>LMS Register for continue</p>
         <input type='text' name='name' placeholder='Name' />
         <input type='number' name='age' placeholder='Age' />
         <input type='email' name='email' placeholder='Email' />
         <input type='password' name='password' placeholder='Password' />
         <div className={'status' + (status?.error ? '':' success')}>{status?.text}</div>
         <input type='submit' value={'Sign Up'}/>
        <div >
            <hr/>
            <span>OR</span>
            <hr/>
        </div>
         <Link to={'/login'}>
            <button style={{background: '#f0f0f0', color: 'black'}}>
                Sign In
            </button>
         </Link>
      </form>
    </div>
  )
}
