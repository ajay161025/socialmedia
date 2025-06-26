const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const {authentication} = require("../middleware/auth")


//create a post 
   router.post("/",authentication,async (req,res)=>{
     const newPost =new Post({userId:req.UserId,...req.body});
     try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
     } catch (error) {
        res.status(500).json(error)
     }
   })


//update a post
   router.put("/:id",authentication, async (req,res)=>{
     try { 
        const post = await Post.findById(req.params.id);
        if(!post) {
           return res.status(404).json("Post not found");
        }
        if (post.userId === req.UserId) {
          await post.updateOne({ $set: req.body });
          res.status(200).json("The post has been updated");
        } else {
          res.status(403).json("You can update only your posts");
        }
     } catch (error) {
        console.log(error)
        res.status(500).json(error)
     }
 });


//delete a post 
router.delete("/:id",authentication, async (req,res)=>{
    try { 
       const post =await Post.findById(req.params.id);
       if (post.userId === req.UserId) {
         await post.deleteOne();
         res.status(200).json("The post has been delete");
       } else {
         res.status(403).json("You can delete only your posts");
       }
    } catch (error) {
       res.status(500).json(error)
    }
})


//likes and dislikes a post 
router.put("/:id/like",authentication, async (req,res)=>{
       try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.UserId)) {
          await post.updateOne({ $push: { likes: req.UserId } });
          res.status(200).json("The post has been likes");
        } else {
          await post.updateOne({ $pull: { likes: req.UserId } });
          res.status(200).json("The post has been disliked");
        }
       } catch (err) {
        res.status(500).json(err)
       }

})
//get a post
router.get("/:id",authentication, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
        
    }
})
//get timeline posts

router.get("/timeline/all",authentication,async (req,res)=>{
    try {
         const currentUser = await User.findById(req.params.userId);
         const userPosts = await Post.find({userId: currentUser._id})
         const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
            return Post.find({userId: friendId})
            })
         );
         } catch (error) {
           res.status(500).json(error)
       }
})

       

module.exports = router; 