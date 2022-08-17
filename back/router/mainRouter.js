const express = require("express")
const router = express.Router()
const {
    register,
    login,
    getUsers,
    loggedIn,
    singleUserItems,
    logout,
    upload,
    
} = require("../controllers/mainController")
const {userValidate} = require ("../middleware/validateUser")

router.post("/register", userValidate, register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/userItems", singleUserItems)
router.post("/upload", upload)

router.get("/userdb", getUsers)
router.get("/loggedin", loggedIn)
module.exports = router
