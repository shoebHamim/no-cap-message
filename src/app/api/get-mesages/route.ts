import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";

dbConnect();

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id)
  try{
    const user= await UserModel.aggregate([
      {$match:{id:userId}}, // i'm pipeline, trust me bro!
      {$unwind:"$messages"},
      {$sort:{"messages.createdAt":-1}},
      {$group:{_id:'$_id',messages:{$push:'$messages'}}}
    ])
    if(!user|| user.length===0){
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: user[0].messages},
      { status: 200 }
    );
  }catch(err){
    console.log('error fetching messages',err);
    return Response.json(
      { success: false, message: "Error fetching message" },
      { status: 500 }
    );

  }
  

}