
const jwt = require('jsonwebtoken');
require("dotenv").config()  ; 
const User = require("../models/User")
const secretKey = process.env.JWT_SECRET

const authenticateToken = async(req, res, next) => {
  const token = req.header('Authorization').replace("Bearer " ,"");
 
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, async(err, data) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    const user = await User.findOne({userId :data.userId})
    if(!user){return res.status(401).json({ error: 'Unauthorized' });}
    
    req.user = user;
  
    next();
  });
};

module.exports = authenticateToken;
