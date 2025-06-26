const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const {authentication} = require("../middleware/auth")

//update user 
router.put("/:id",authentication, async (req, res) => {
    if (req.body.userId === req.params.id  || req.body.isAdmin ) {
        if (req.body.password) {
            try{
                
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.params.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
            try{
               
                const user = await User.findByIdAndUpdate(req.body.id,{$set: req.body,});                        
                res.status(200).json("Account has been update");
            }catch(err){
             return res.status(500).json(err);

            }
        } else {
            return res.status(403).json("You can only update your account");
        }
    }
});


//delete user 
router.delete("/:id", authentication, async (req, res) => {
    if (req.body.userId === req.params.id  || req.body.isAdmin ) {
            try{
               
                const user = await User.findByIdAndDelete(req.body.id);                        
                res.status(200).json("Account has been delete");
            }catch(err){
             return res.status(500).json(err);

            }
        } else {
            return res.status(403).json("You can only delete your account");
        }
    }
);

//get a user
router.get("/:id",authentication, async (req,res)=>{
      try {
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other)
      } catch (err) {
        res.status(500).json(err)
      }

})
//follow user
   router.put("/:id/follow",authentication,async (req,res)=>{
      if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{ followers:req.body.userId}});
                await currentuser.updateOne({$push:{ followings:req.params.id}});
                res.status(200).json("User has been followed");
            }else{
                res.status(403).json("You already follow this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
      } else {
       res.status(403).json("You cant follow yourself");
      }
    })
//unfollow user
router.put("/:id/unfollow",authentication,async (req,res)=>{
    if(req.body.userId !== req.params.id){
      try {
          const user = await User.findById(req.params.id);
          const currentuser = await User.findById(req.body.userId);
          if(user.followers.includes(req.body.userId)){
              await user.updateOne({$pull:{ followers:req.body.userId}});
              await currentuser.updateOne({$pull:{ followings:req.params.id}});
              res.status(200).json("User has been unfollowed");
          }else{
              res.status(403).json("You dont follow this user");
          }
      } catch (error) {
          res.status(500).json(error);
      }
    } else {
     res.status(403).json("You cant unfollow yourself");
    }

});



module.exports = router;

