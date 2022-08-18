import React, {useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom'
const Login = ({update, socket}) => {
    const [errMssg, setErrMsg] = useState("")
    const username = useRef()
    const pass = useRef()
    const nav = useNavigate()

    function logUser() {
        const user = {
            email: username.current.value,
            pass: pass.current.value,
        }
        const options = {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(user)
      }

      fetch('http://localhost:4001/login', options)
      .then(r => r.json())
      .then(data => {
        setErrMsg(data.message)
        update()
        if (data.success){
            nav("/main")
            socket.connect();
        }
    })
    } 
    return(
        <div className='inputWrapper'>
            <div className='inputs'>
                <input type="text" placeholder="username" ref={username} />
                <input type="password" placeholder="password" ref={pass}/>
                <p>{errMssg}</p>
                <button onClick={logUser}>Login</button>
            </div>
        </div>
    )
}

export default Login