const express = require('express')
const app = express()
const cors = require("cors")
const http = require('http').createServer(app)
const mongoose = require("mongoose")
const session = require("express-session")
const socketIo = require('socket.io')
const io = socketIo (http, {cors:{origin: "http://localhost:3000"}})
const itemScheme = require("./models/itemScheme")
const userScheme = require("./models/userScheme")
require("dotenv").config()

mongoose.connect("mongodb+srv://admin:klemis@cluster0.2s1ijtw.mongodb.net/?retryWrites=true&w=majority")
    .then(res => {
        console.log('all good, database connected')
    }).catch(e => {
    console.log(e)
})

// app.listen(4001)
http.listen(4001)
app.set("socketio", io)
let requests = []
let users = []
let userRequests = []
io.on("connect", (socket) => {
    socket.emit("myRequests", requests);

    socket.on ('disconnect', () => {
        users = users.filter(x => x.id !== socket.id)
       console.log(users); 
    }) 
    socket.on ('addUser', (name) => {
        const thisUser = {
            id: socket.id,
            name: name
        }
        users.push(thisUser)
        console.log(users);
    })

    socket.on('sendCart', (request) => {
        const requestor = users.find(x => x.id === socket.id)
        request.requestor = requestor.name
        request.id = Date.now()
        requests.push(request);
        io.emit("myRequests", requests);
    })

    socket.on('notify', (currentUser) => {
        // userRequests = requests.filter(x => x.owner === currentUser)
        socket.emit("myRequests", requests);
    })
    socket.on("acceptRequest", async (rqst) => {
        // console.log(rqst)
        const newOwner = await userScheme.findOne({username:rqst.requestor})
        rqst.items.map(async (x) => {
            try{
                await itemScheme.findOneAndUpdate ({_id: x._id},{$set: {owner: newOwner.id}} )
                requests = requests.filter(y => y.id !== rqst.id)
            } catch(e) {
                console.log("fail")
            }
        })
        io.emit("updt")
        const recievingSocketId = users.find(x => x.name === rqst.requestor)
        // console.log(recievingSocketId)
        const message = "Your request has been accepted"
        // socket.emit("rqsResponse", message)
        io.to(recievingSocketId.id).emit('rqsResponse', message)
    })
    socket.on("declineRequest", (rqst) => {
        requests = requests.filter(y => y.id !== rqst.id)
        const message = "Your request has been declined"
        // socket.emit("rqsResponse", message)
        const recievingSocketId = users.find(x => x.name === rqst.requestor)
        io.to(recievingSocketId.id).emit('rqsResponse', message)
    })
   
})



app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(cors({origin: true, credentials: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE"}))

app.use(express.json())



const router = require("./router/mainRouter")
app.use("/", router)