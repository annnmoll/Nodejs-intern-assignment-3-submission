const cloudinary = require('cloudinary').v2;
const Post = require('../models/Post');
const User = require('../models/User');
const imageUpload = require("../utils/imageUpload")
const mongoose = require("mongoose") ; 


const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { _id   , userId} = req.user;
    

    const {postImage} = req.files
    let imageUrl;
    if (postImage) {
      const result =await  imageUpload(postImage , "sociomedia")
      imageUrl = result.secure_url;
    }
    
    const post = new Post({ text, imageUrl, author: _id});
    await post.save();

    console.log(post) ; 
    await User.findByIdAndUpdate(_id, { $push: { posts: post._id } });

    
    res.status(200).json( { success : true  , post});
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success : false , error: 'Error creating post' });
  }
};

const deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId , _id } = req.user;
  
      // Find the post by ID
      const post = await Post.findById(postId);
  
      // Check if the post exists
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the user is the author of the post
      if (post.author.toString() !== _id) {
        return res.status(403).json({ error: 'Unauthorized to delete this post' });
      }
  
     
      await post.remove();
  
      // Remove the post ID from the user's posts array
      await User.findByIdAndUpdate(_id, { $pull: { posts: postId } });
  
      // Send a success message in the response
      res.status(200).json({ success : true , message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Error deleting post' });
    }
  };


  const updatePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId , _id } = req.user;
      const { newText } = req.body;
  
      // Find the post by ID
      const post = await Post.findById(postId);
  
      // Check if the post exists
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the user is the author of the post
      if (post.author.toString() !== _id) {
        return res.status(403).json({ error: 'Unauthorized to update this post' });
      }
  
      // Update the text of the post
      post.text = newText;
      await post.save();
  
      // Send the updated post in the response
      res.status(200).json({success : true , post});
    } catch (error) {
      console.error('Error updating post text:', error);
      res.status(500).json({ error: 'Error updating post text' });
    }
  };
  


module.exports = {
  createPost,
  deletePost , updatePost
};
 