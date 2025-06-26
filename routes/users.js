const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { authentication } = require("../middleware/auth");

//update user
router.put("/:id", authentication, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.UserId, {
      $set: req.body,
    });
    res.status(200).json("Account has been update");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", authentication, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.UserId);
    res.status(200).json("Account has been delete");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//get a user
router.get("/:id", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json("User not found")
    }
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
//follow user
router.put("/:id/follow", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const currentuser = await User.findById(req.UserId);
    if (!user.followers.includes(req.UserId)) {
      await user.updateOne({ $push: { followers: req.UserId } });
      await currentuser.updateOne({ $push: { followings: req.params.id } });
      res.status(200).json("User has been followed");
    } else {
      res.status(403).json("You already follow this user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//unfollow user
router.put("/:id/unfollow", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const currentuser = await User.findById(req.UserId);
    if (user.followers.includes(req.UserId)) {
      await user.updateOne({ $pull: { followers: req.UserId } });
      await currentuser.updateOne({ $pull: { followings: req.params.id } });
      res.status(200).json("User has been unfollowed");
    } else {
      res.status(403).json("You dont follow this user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
