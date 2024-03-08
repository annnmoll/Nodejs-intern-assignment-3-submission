const express = require("express") ; 
const { signUp, login, updateProfile } = require("../controllers/userControllers");
const router = express.Router() ;
const isAuthenticated = require("../middlewares/isAuthenticated")

router.post("/signup" , signUp) ; 
router.get("/login" , login)
router.put("/update" ,isAuthenticated , updateProfile)

module.exports = router ;  