import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Single from "./pages/Single"
import Upload from "./pages/Upload";
import Notifications from "./pages/Notifications";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4001");

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [logCounter, setCounter] = useState(0);
  const [respMessage, setRespMessage] = useState("")
  const [requestss, setRequests] = useState([])

  useEffect(() => {
    update();
    socket.on("rqsResponse", message => {
      setRespMessage(message)
      setTimeout(() => {
        setRespMessage("")
      }, 5000);
    })
  }, [socket]);

  function logout() {
    const user = {
      user: null,
    };
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    };
    fetch("http://localhost:4001/logout", options)
      .then((res) => res.json())
      .then((data) => {
        update();
        socket.disconnect()
      });
  }

  async function update() {
    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    };
    fetch("http://localhost:4001/loggedin", options)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setCurrentUser(data.message);
        // console.log(currentUser);
        if (!data.message) return
        const user = data.message
        socket.emit("addUser", user)
      });
  }
  return (
    <BrowserRouter> 
      <div className="App">
        <nav>
          {currentUser ? (
            <div>
              <ul>
                <li><h3>Loggedin as: <i>{currentUser}</i></h3></li>
                <li><Link to="/"><h3 className="logout" onClick={logout}>Logout</h3></Link></li>
                <li><Link to="/main"><h3>Main</h3></Link></li>
                <li><Link to="/upload"><h3>Upload</h3></Link></li>
                <li><Link to="/notify"><h3>Notifications ({requestss.length})</h3></Link></li>
                {respMessage.length > 0? <li><h3>{respMessage}</h3></li> : null}

              </ul>
            </div>
          ) : (
            <div>
              <ul>
                <li><Link to="/register"><h3>Register</h3></Link></li>
                <li><Link to="/"><h3>Login</h3></Link></li>
              </ul>
            </div>
          )}
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <Login
                logCounter={logCounter}
                setCounter={setCounter}
                update={update}
                socket={socket}
              ></Login>
            }
          ></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/main" element={<Main></Main>}></Route>
          <Route
            path="/single/:id"
            element={<Single currentUser={currentUser} socket={socket}></Single>}
          ></Route>
          <Route path="/upload" element={<Upload></Upload>}></Route>
          <Route path="/notify" element={<Notifications socket={socket} currentUser={currentUser} requestss={requestss}  setRequests={setRequests}></Notifications>}></Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
