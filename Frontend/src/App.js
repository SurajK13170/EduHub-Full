import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { useEffect } from 'react';
import { API_URL } from './config';
import { useAuth } from './context/AuthContext';
import Lecturs from './components/auth/Lecturs';


function App() {
  const {setAuth} = useAuth()
  const [Loading, setLoading] = useState(true)

 useEffect(() => {
  const getUser = async () => {
    try{
      let _token = window.localStorage.getItem('_token')
      if(_token){
        let res = await fetch(`${API_URL}/user/auth`, {
          headers: {'Authorization': `Bearer ${_token}`}
        })
        let data = await res.json()
        data.enrolledCourses= new Set(data.enrolledCourses)
        setAuth({user: data, token: _token})
      }
    }catch(err){
      return err
    }finally{
      setLoading(false)
    }
    
  }

  getUser()
 }, [])
 if(Loading){
  return "Loading..."
 }
 return (
  <div className='app'>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/lecture/:id' element={<Lecturs />} />

      </Routes>
    </BrowserRouter>
  </div>
 )
}

export default App;
