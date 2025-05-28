const mongoose = require("mongoose");
// const { userInfo, type } = require("os");
// const { stringify } = require("querystring");
 

const UserSchema = new mongoose.Schema({

username:{
    type:String,
    require:true,
    unique:true,
    min:4,
    max:20,
},

email:{
    type:String,
    require:true,
    unique:true,
    max:50,
},

password:{
    type:String,
    require:true,
    min:3,
    max:15,
    unique:true,
},

profilepicture:{
         type:String,
          default:""
    
}, 

coverpicture:{
         type:String,
         default:""
},

followers:{
    type:Array,
    default: []
},


followings:{
    type:Array,
    default: []
},

isAdmin:{
    type:Boolean,
    Boolean:false,
},
desc:{
    type:String,
     max:50,

},
city:{
    type:String,
    max:50,
},
form:{
    type:String,
    max:50,
},
relationship:{
    type:Number,
    enum:[1,2,3],
},
 

},
  {timestamps:true},

); 


module.exports = mongoose.model("user",UserSchema);