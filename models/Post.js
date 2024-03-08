const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  text: String,
  imageUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
} , 
{timestamps : true });

module.exports= mongoose.model('Post', postSchema);


