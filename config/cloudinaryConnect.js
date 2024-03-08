const cloudinary  = require("cloudinary").v2;
require("dotenv").config() ;

async function cloudinaryConnect(){
    try{
       await cloudinary.config({ 
            cloud_name: process.env.CLOUD_NAME , 
            api_key: process.env.CLOUD_API, 
            api_secret: process.env.CLOUD_SECRET 
          });
          console.log("Connected to cloudinary successfully")

    }catch(e){
        console.log(e.message)
    }
    
}

module.exports = cloudinaryConnect ;
          