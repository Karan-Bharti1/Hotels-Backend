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

const readHotelByName=async(hotelName)=>{
    try{
const hotel=await Hotel.findOne({name:hotelName})
return hotel
    }catch (error){
        throw error
    }
}
app.get("/hotels/:hotelName",async(req,res)=>{
    const hotel=await readHotelByName(req.params.hotelName)
  try {
    if(hotel){
res.status(201).json(hotel)
    }else{
res.status(404).json({error:"Hotel Not Found"})
    }
    
  } catch (error) {
    res.status(500).json({error:"Failed to fetch the data"})
  }
})
const readHotelByPhoneNumber=async(phNumber)=>{

    try {
        const hotel=await Hotel.findOne({phoneNumber:phNumber})
        console.log(hotel)
        return hotel     
    } catch (error) {
        throw error
    }
}
app.get("/hotels/directory/:phNumber",async(req,res)=>{
    const hotel=await readHotelByPhoneNumber(req.params.phNumber)
    try {
        if(hotel){
    res.status(201).json(hotel)
        }else{
    res.status(404).json({error:"Hotel Not Found"})
        }
        
      } catch (error) {
        res.status(500).json({error:"Failed to fetch the data"})
      }
})
const readHotelByRating=async(hotelRating)=>{
    try {
       const hotels=await Hotel.find({rating:hotelRating})
       console.log(hotels)
       return hotels
    } catch (error) {
       throw error 
    }
}
app.get("/hotels/rating/:hotelRating",async(req,res)=>{
const hotels=await readHotelByRating(parseFloat(req.params.hotelRating))
try {
   if(hotels.length!=0){
    res.status(201).json(hotels)
   } else{
    res.status(404).json({error:"Hotels not found"})
   }
} catch (error) {
    res.status(500).json({error:"Failed to fetch the data"}) 
}
})
async function readHotelsByCategory(categoryName) {
try {
    const hotels=await Hotel.find({category:categoryName})
    return hotels
} catch (error) {
    throw error
}
}
app.get("/hotels/category/:hotelCategory",async(req,res)=>{
    const hotels=await readHotelsByCategory(req.params.hotelCategory)
    try {
        if(hotels.length!=0){
         res.status(201).json(hotels)
        } else{
         res.status(404).json({error:"Hotels not found"})
        }
     } catch (error) {
         res.status(500).json({error:"Failed to fetch the data"}) 
     }
})

async function createHotel(newHotel){
    try{
const hotel=new Hotel(newHotel)
const saveHotel=await hotel.save()

return saveHotel
    }catch(error){
      throw error
    }
}

app.post("/hotels",async(req,res)=>{
    try {
        const savedData=await createHotel(req.body)
        res.status(201).json({message:"Data added successfully.",savedData})
    } catch (error) {
       res.status(500).json({error:"Failed to add data"}) 
    }
})
async function deleteHotelData(hotelId){
    try {
       const deletedHotel=await Hotel.findByIdAndDelete(hotelId) 
       return deletedHotel
    } catch (error) {
        throw error
    }
}
app.delete("/hotels/:hotelId",async(req,res)=>{
    const deletedHotel=await deleteHotelData(req.params.hotelId)
    try {
        if(deletedHotel){
            res.status(201).json({message:"Hotel Deleted Successfully"})
        }else{
            res.status(404).json({message:"Data Not Found"})
        }
        
    } catch (error) {
        res.status(500).json({error:"Failed to fetch the data"})
    }
})
app.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})