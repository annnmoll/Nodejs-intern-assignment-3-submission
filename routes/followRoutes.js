const express = require("express") ;
const router = express.Router() ;
const isAuthenticated = require("../middlewares/isAuthenticated");
const { followUser, unfollowUser, getFollowingList, getFollowersList } = require("../controllers/followController");


router.post('/follow', isAuthenticated, followUser);
router.post('/unfollow', isAuthenticated, unfollowUser);
router.get('/following', isAuthenticated, getFollowingList);
router.get('/followers',isAuthenticated, getFollowersList);




module.exports = router ;


