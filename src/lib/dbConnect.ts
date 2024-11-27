import mongoose from "mongoose";

type ConnectionObject={
  isConnected?:number,
}
const connection:ConnectionObject={}

async function dbConnect():Promise<void> {
  if(connection.isConnected){
    console.log('Already connected to DB');
  }
  try{
    const db=await mongoose.connect(process.env.MONGODB_URI||"",{})
    console.log(db);
    connection.isConnected=db.connections[0].readyState
    console.log('db connected successfully');
  }catch(error){
    //exit process gracefully
    console.log('DB connection failed',error);
    process.exit()
  }
}

export default dbConnect;