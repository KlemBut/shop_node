const userScheme = require("../models/userScheme")
    
module.exports = {
    userValidate: async (req, res, next) => {
        const user = req.body
        const existingUser = await userScheme.findOne({username: user.email})
        console.log(user)
        function checkUppercase(str){
            for (var i=0; i<str.length; i++){
              if (str.charAt(i) == str.charAt(i).toUpperCase() && str.charAt(i).match(/[a-z]/i)){
                return true;
              }
            }
            return false;
        };

        if(!user.email) return res.send({message: "Enter a username"})
        if(existingUser) return res.send({message: "Username taken"})
        if(user.email.length < 5) return res.send ({message: "Useername needs to be at least 5 charcters"})
        if(!checkUppercase(user.email)) return res.send ({message: "Username needs an uppercase letter"})
        if(user.passOne !== user.passTwo) return res.send({message: "Passwords need to match"}) 
        if(user.passOne.length < 5) return res.send({message: "Passwords too short"}) 

        res.send({message: "success"})
        next()
    }
}