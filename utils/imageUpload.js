const cloudinary = require("cloudinary").v2 ;

async function imageUpload(image , folder){
    try{
        const tempPath = image.tempFilePath
        // console.log(tempPath)
        const result = await cloudinary.uploader.upload(tempPath , { folder })
        // console.log(result)
        return result
    }catch(error){
        console.log(error)
    } 
}


module.exports = imageUpload ; 