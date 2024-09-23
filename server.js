//import express, {request, response} from "express"; //package.json ma "type":"module" garyo vane use garna milxa
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDB();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use('/api/contacts',require("./routes/contactRoute"));
app.use('/api/users',require("./routes/userRoutes"));
app.use(errorHandler);




app.listen(port,()=>{
    console.log(`app running on port ${port}`);
    
});