const User = require('../models/User');

const followUser = async (req, res) => {
  try {
    const {  _id } = req.user;
    const { followUserId } = req.body;

    // Check if the user is trying to follow themselves
    if (_id === followUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if the user to be followed exists
    const followUser = await User.findById(_id);
    if (!followUser) {
      return res.status(404).json({ error: 'User to follow not found' });
    }

    // Check if the user is already following the target user
    if (req.user.following.includes(followUserId)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Update the user's following list
    await User.findByIdAndUpdate(_id, { $push: { following: followUserId } });

    // Update the target user's followers list
    await User.findByIdAndUpdate(followUserId, { $push: { followers: _id } });

    res.status(200).json({ message: 'User followed successfully' , success : true });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Error following user' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const { unfollowUserId } = req.body;

    // Check if the user to be unfollowed exists
    const unfollowUser = await User.findById(unfollowUserId);
    if (!unfollowUser) {
      return res.status(404).json({ error: 'User to unfollow not found' });
    }

    // Check if the user is currently following the target user
    if (!req.user.following.includes(unfollowUserId)) {
      return res.status(400).json({ error: 'Not currently following this user' });
    }

    // Update the user's following list
    await User.findByIdAndUpdate(_id, { $pull: { following: unfollowUserId } });

    // Update the target user's followers list
    await User.findByIdAndUpdate(unfollowUserId, { $pull: { followers: _id } });

    res.status(200).json({ message: 'User unfollowed successfully' , success : true  });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Error unfollowing user' });
  }
};

const getFollowingList = async (req, res) => {
  try {
    const { _id } = req.user;

    // Find the user and populate the following field
    const user = await User.findById(_id).populate('following', 'username');

    // Extract the list of followed users
    const followingList = user.following.map((followedUser) => ({
      userId: followedUser._id,
      username: followedUser.username,
    }));

    res.status(200).json({success : true ,  followingList });
  } catch (error) {
    console.error('Error getting following list:', error);
    res.status(500).json({ error: 'Error getting following list' });
  }
};

const getFollowersList = async (req, res) => {
  try {
    const { _id } = req.user;

    // Find the user and populate the followers field
    const user = await User.findById(_id).populate('followers', 'username');

    // Extract the list of followers
    const followersList = user.followers.map((follower) => ({
      userId: follower._id,
      username: follower.username,
    }));

    res.status(200).json({success : true ,  followersList });
  } catch (error) {
    console.error('Error getting followers list:', error);
    res.status(500).json({ error: 'Error getting followers list' });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowingList,
  getFollowersList,
};
