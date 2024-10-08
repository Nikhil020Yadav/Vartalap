const express = require('express')
//const cors = require('cors')
require('dotenv').config()
var cors=require('cors');
//app.use(cors())
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const {app,server}=require ('./socket/index')


//const app=express()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://vartalap-frontend-qet43xgsv-nikhil020yadavs-projects.vercel.app'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
const cookiesParser=require('cookie-parser')
app.use(cors({
    //origin:process.env.FRONTEND_URL,
    origin: 'https://vartalap-frontend-qet43xgsv-nikhil020yadavs-projects.vercel.app',
    credentials:true
}))
// app.use(cors());

app.use(express.json())
app.use(cookiesParser())
const PORT=process.env.PORT || 8080

app.get('/',(request,response)=>{
    response.json({
        message : "Server running at "+PORT
    })
})

//api end point
app.use('/api',router);
connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server running at " + PORT)
    })
})


  
  
