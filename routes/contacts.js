const express = require("express")
const router = express.Router()



router.get("/contacts",(req,res)=>{
    res.render("contacts")
})

module.exports = router