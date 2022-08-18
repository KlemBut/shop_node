const userScheme = require("../models/userScheme")
const itemScheme = require("../models/itemScheme")
const bcrypt = require("bcrypt")
module.exports = {
    register: async (req, res) => {
        const {email, passOne} = req.body
        const user = new userScheme()
        user.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png"
        user.username = email
        user.password = await bcrypt.hash(passOne, 10)
        try{
            await user.save()
        } catch(e) {
            console.log("not saved")
        }
        res.send({ok: "ok"})
    },
    upload: async (req, res) => {
        const {img, title} = req.body
        if (!img) return res.send({success: false, message:"Image URL missing"})
        if (!title) return res.send({success: false, message:"Title missing"})

        const item = new itemScheme()
        item.owner = req.session.userId
        item.img = img
        item.title = title
  
        try{
            await item.save()
        } catch(e) {
            console.log("not saved")
        }
        res.send({success: true})
    },
    login: async (req, res) => {
        const {email, pass} = req.body
        const user = await userScheme.findOne({username: email})

        if (!user) return res.send({success: false, message: "Username not found"})
        const passMatch = await bcrypt.compare(pass, user.password)
        if(!passMatch) return res.send({success:false, message:"Wrong password"})
        
        req.session.username = user.username
        req.session.userId = user._id
        res.send({success: true})
            
    },
    getUsers: async (req, res) => {
        const items = await userScheme.find()
        res.send({message: items})
    },
    loggedIn: async (req, res) => {
        
        res.send({message: req.session.username})
    },
    logout: async (req, res) => {
        req.session.username = req.body.user
        res.send({message: "loggedout"})
    },
    singleUserItems: async (req, res) => {
        const user = await userScheme.findOne({_id: req.body.id})
        const userItems = await itemScheme.find({owner: req.body.id})
        res.send({message: userItems, user: user})
    },
    
}