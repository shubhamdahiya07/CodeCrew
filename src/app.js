import express from "express";
import userRoutes from './routes/userRoutes.js'
const port=5000;

const app = express();

app.use(express.json());

app.use("/api/users",userRoutes);

app.listen(port,()=>{
    console.log("App is listining at " + port);
})