const mongoose = require('mongoose');
const validator = require ('validator')
const bcryptjs = require('bcryptjs')

const UserSchema = new mongoose.Schema({
username:{
        type:String,
        require:true,
        trim:true,

    },
    email:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(val){
            if(validator.isEmpty(val)){
                throw new Error ("email is invalid")
            }
        }
    },
    password:{
        type:String,
        require:true,
        trim:true,
        minlength:8,
        validate(val){
            if(val <= 8  ){
                throw new Error("password must be greater than 8")
            }
        }
    }
    });


    UserSchema.pre("save",async function(){
        const user =this
        console.log(user)

         if(user.isModified('password')){
            user.password=await bcryptjs.hash(user.password,8)
        }
    })
       
    const User = mongoose.model("User", UserSchema);
    module.exports = User;