import client from "../config/db.js";

export const findUserByEmail = async(email) =>{
    return await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
}

export const createUser = async(firstname,lastname,email,hashedPassword) =>{
    return await client.query(`INSERT INTO users (firstname, lastname, email, password) VALUES ($1,$2,$3,$4)`,[firstname,lastname,email,hashedPassword])
}

export const checkLoginDetails = async(email) =>{
    return await client.query('SELECT * FROM users WHERE email = $1',[email]);
}

export const getProfileDetails = async(id)=>{
    return await client.query(`SELECT * FROM users WHERE id = $1`,[id])
}

export const sendConnectionRequest = async(fromUserId,toUserId)=>{
    return await client.query(`INSERT INTO connection_requests (from_user_id, to_user_id, status) VALUES ($1,$2,$3)`,[fromUserId,toUserId,"pending"])
}