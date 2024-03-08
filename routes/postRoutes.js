const express = require("express") ; 
const { createPost, deletePost, updatePost } = require("../controllers/postController");
const router = express.Router() ; 
const isAuthenticated = require("../middlewares/isAuthenticated")

router.post("/post"  ,isAuthenticated ,  createPost)
router.delete("/delete/:postId" , isAuthenticated , deletePost)
router.put('/update/:postId', isAuthenticated, updatePost);

module.exports = router ;