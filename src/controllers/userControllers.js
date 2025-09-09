import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {findUserByEmail,createUser,checkLoginDetails,getProfileDetails,sendConnectionRequest} from "../models/userModel.js";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)

export const signup =  async(req,res) => {

    try {
        const {firstname, lastname, email, password} = req.body;

        if(firstname==="" || lastname==="" || email==="" || password==="")
        {
            return res.status(400).json({error: "All fields are required"})
        }

        const existingUser = await findUserByEmail(email);
        if(existingUser.rows.length>0)
        {
            return res.status(400).json({error:"user with this email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,saltRounds);
        await createUser(firstname,lastname,email,hashedPassword);

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async(req,res) =>{
    try {
        const {email,password} = req.body;
        
        const loginCheck = await checkLoginDetails(email);
        
        const hashedPassword = loginCheck.rows[0].password;

        const isValidUser = await bcrypt.compare(password, hashedPassword); 
        
        if(isValidUser){
            const token = jwt.sign(
                {id: loginCheck.rows[0].id,email:loginCheck.rows[0].email}, //Details with which is should be signed
                process.env.JWT_SECRET, //your jwt secret
                {expiresIn:process.env.JWT_EXPIRES_IN} //expiration time of token
            );
            res.status(200).json({message:"Login Successful",token});
        }
        else{
            res.status(401).json({message:"Please check email and password"});
        }
    } catch (error) {
        console.log("Error while logging in ",error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const profile = async(req,res)=>{
    try {
        const profileDetails = await getProfileDetails(req.user.id);
        console.log(req.user, "profileDetails");
        res.status(200).json(profileDetails.rows[0]);
    } catch (error) {
        console.log("Error while fetching profile ",error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const sendRequest = async(req,res)=>{
    try {
        const fromUserId = req.user.id;
        const toUserId = req.body.id;

        await sendConnectionRequest(fromUserId,toUserId);

        res.status(200).json({message:"Request Sent successfully"});
    } catch (error) {
        console.log("Error while sending request",error);
        res.status(400).json({error:"Internal Server Error"});
    }
}