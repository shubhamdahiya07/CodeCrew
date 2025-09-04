import express from "express";
import client from "./config/db.js";
const port=5000;

const app = express();

app.get('/',(req,res)=>{
    res.send("Connection Eastablished")
})

app.listen(port,()=>{
    console.log("App is listining at " + port);
})