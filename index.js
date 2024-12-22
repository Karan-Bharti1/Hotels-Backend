const {initializerDb}=require('./Database/db.connect')
initializerDb()
const cors=require('cors')
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  }
const express=require('express')
const app=express()
const Hotel=require('./hotels.models')
app.use(express.json())
app.use(cors(corsOptions))
const PORT= 3000
const readAllHotels=async()=>{
   try {
    const hotels=await Hotel.find()
    return hotels
   } catch (error) {
    throw error
   } 
}

app.get("/hotels",async(req,res)=>{
    const hotels=await readAllHotels()
    try{
        if(hotels.length!=0){
            res.status(201).json(hotels)
        }else{
            res.status(404).json({error:"Hotels not found"})
        }

    }catch(error){
        res.status(500).json({error:"Failed to fetch the data"})
    }
})
app.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})