const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Register user
//@route POST /api/register
//@access public
const registerUser = asyncHandler(async (request, response)=>{
    const{username, email, password} = request.body;
    if(!username||!email||!password){
        response.status(400);
        throw new Error("All firlds are mandatory!!");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        response.status(400);
        throw new Error("user already registered");
    }

    //hash pass
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`user created successfully ${user}`);
    if(user){
        response.status(201).json({_id: user.id, email: user.email })
    }else{
        response.status(400);
        throw new Error("User data is not valid");
    }

    
    response.json({message:"register user"});
});

//@desc login user
//@route POST /api/login
//@access public
const loginUser = asyncHandler(async (request, response)=>{
    const {email, password} = request.body;
    if(!email||!password ){
        response.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email });
    //compare password with hash
    if(user&&(await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email:user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"12m"}
    )
        response.status(200).json({accessToken});
    }else{
        response.status(401);
        throw new Error("email or password invalid");
    }
    
});

//@desc current user
//@route GET /api/current
//@access private
const currentUser = asyncHandler(async (request, response)=>{
    response.json(request.user);
});

module.exports = { registerUser, loginUser, currentUser };