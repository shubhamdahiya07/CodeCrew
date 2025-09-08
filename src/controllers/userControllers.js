import bcrypt from "bcrypt";
import {findUserByEmail,createUser,checkLoginDetails} from "../models/userModel.js";
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
            res.status(200).json({message:"Login Successfull"});
        }
        else{
            res.status(401).json({message:"Please check email and password"});
        }
    } catch (error) {
        console.log("Error while logging in ",error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}