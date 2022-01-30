var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var findOrCreate= require("mongoose-findorcreate");
  
  
var UserSchema = new Schema({   
    name:{type:String, required: true},
    email: {type: String, required:true, unique:true},
    username : {type: String, unique: true, required:true},
    password: String
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);
// exporting Users model
module.exports=mongoose.model("User", UserSchema);