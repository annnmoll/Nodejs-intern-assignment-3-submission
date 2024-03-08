const express = require("express") ; 
const dbConnect = require("./config/dbConnect")
const cloudinaryConnect = require("./config/cloudinaryConnect")
const fileUpload = require("express-fileupload")
require("dotenv").config() ; 
const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoutes")
const followRouter = require("./routes/followRoutes") 


const app = express() ; 
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use("/api/v1" , userRouter) ; 
app.use("/api/v1" , postRouter) ;

app.listen(process.env.PORT , ()=>{console.log(`Server started successfully at ${process.env.PORT} PORT`)}) 
dbConnect() ;
cloudinaryConnect() ; 

app.get("/" , (req , res) => {res.send("Server is working fine")})