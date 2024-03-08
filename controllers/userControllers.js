const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const imageUpload = require("../utils/imageUpload")
require("dotenv").config() ; 



const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

      // Check if the username is already taken
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ success : false ,  error: 'Username already taken' });
      }
  
      // Check if the email is already registered
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({success : false ,  error: 'Email already registered' });
      }
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser.userId, username: newUser.username }, process.env.JWT_SECRET);

    // Send the token in the response
    res.status(200).json({ token , user: newUser , success : true  });
  } catch (error) {
    res.status(500).json({success : false ,  error: 'Error creating user' });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find the user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    // Check if the user exists and the password is correct
    if (!user || !(bcrypt.compare(password, user.password))) {
      return res.status(401).json({  success : false , error: 'Invalid credentials' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET);

    // Send the token in the response
    return res.status(200).json({ token , user , success : true  });
  } catch (error) {
    res.status(500).json({ success : false ,  message: 'Error logging in' , error : error });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user; // Extract user ID from the authenticated user
    const { username, bio} = req.body;
    const {profileImage} = req.files

    // Find the user by ID
    

    // Check if the user exists
    if (!user) {
      return res.status(404).json({success : false ,  error: 'User not found' });
    }

    // Update user profile details
    user.username = username || user.username;
    user.bio = bio || user.bio;
    if(profileImage){

   const profilePicture = await imageUpload(profileImage , "sociomedia");
      user.profilePictureUrl = profilePicture.secure_url ; 
  
  }
  // user.profilePictureUrl = profilePictureUrl ; 
    // Save the updated user profile
    await user.save();

    // Send the updated user profile in the response
    res.json({
      success : true  , 
      userId: user.userId,
      username: user.username,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl,
    });
  } catch (error) {
    res.status(500).json({ success : false , error: 'Error updating user profile' });
  }
};

module.exports = {
  signUp,
  login , 
  updateProfile
};
