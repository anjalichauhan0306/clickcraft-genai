import { Request , Response} from 'express';
import User from '../models/user.js'
import bcrypt from 'bcrypt';

export const registerUser = async(req:Request, res:Response) =>{
    try {
        console.log(req.body)
        const {name , email , password} = req.body;
        // find user by email 
        const user = await User.findOne({email});

        if (!password) {
    return res.status(400).json({ message: "Password missing" });
  }

        
        if(user){
            return res.status(400).json({message:"User already exists"});
        }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password , salt)

            const newUser = new User({
                name , email , password : hashedPassword
            })

            await newUser.save();
console.log("SAVED USER:", newUser);
            // Setting User Data in Session

            req.session.isLoggedIn = true;
            req.session.userId = newUser._id;

            return  res.json({message:"User regi okk successfully", 
                user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                password:newUser.password
            }});
    }
 catch (error : any) {
    console.log(error);
    return res.status(500).json({message:error.message});
    }
}

// Login User

export const loginUser = async(req:Request, res:Response) =>{
    try {

        const {email , password} = req.body;
        // find user by email 
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Email Or Password !"});
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Email Or Password !"});
        }



            // Setting User Data in Session
            req.session.isLoggedIn = true;
            req.session.userId = user._id.toString();

            return  res.status(201).json({message:"login successfully", user:{
                id:user._id,
                name:user.name,
                email:user.email
            }});

    }catch(error : any){
        console.log(error);
        res.status(500).json({message: error.message})
    }
}

// Logout User
export const logoutUser = (req:Request, res:Response) =>{
    req.session.destroy((error : any) => {
        if(error){
            console.log(error);
            return res.status(500).json({message:"Could not log out. Please try again."});
        }
    });

    return res.json({message:"Logged out successfully"});
}

// Controller For User Vefity 

export const verifyUser = async(req:Request, res:Response) =>{
    try{
        const {userId} = req.session;
        const user = await User.findById(userId).select('-password');

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        return res.json({user});
    }
    catch(error : any){
        console.log(error);
        res.status(500).json({message: error.message})
    }
}