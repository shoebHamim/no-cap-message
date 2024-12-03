import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";




const UsernameQuerySchema= z.object({
  username:usernameValidation,
})


export async function GET(request:Request) {
  await dbConnect()
  // localhost:3000/api/check-username-unique?username=hamim

  try {
    const {searchParams}=new URL(request.url)
    const queryParam={
      username:searchParams.get("username")
    }

    const result=UsernameQuerySchema.safeParse(queryParam)
    // console.log(result.error?.format());
    if(!result.success){
      const usernameError=result.error.format().username?._errors || []
      return Response.json({
        success:false,
        message:usernameError?.length>0?usernameError.join(', '):"invalid query parameter",
        status:400
      },{status:400})
    }
    const {username}=result.data
    const existingVerifiedUser= await UserModel.findOne({username, isVerified:true})
    if(existingVerifiedUser){
      return Response.json({
        success:false,
        message:"username is already taken",
        status:400
      },{status:400})
    }
    return Response.json({
      success:true,
      message:"username is unique",
      status:200
    },{status:200})




    
  } catch (error) {
    console.error("Error checking username",error)
    return Response.json({
      success:false,
      message:"Error checking username"
    },{
      status:500
    })
    
  }
}