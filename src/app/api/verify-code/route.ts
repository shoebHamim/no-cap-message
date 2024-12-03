import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export async function POST(request:Request){
  await dbConnect()
  try {
    const {username,code}=await request.json()
    const decodedUsername=decodeURIComponent(username)
    const user=await UserModel.findOne({username:decodedUsername})
    if(!user){
      return Response.json({
        success:false,
        message:"User not found"
      },{status:404})
    }
    const isCodeValid=user.verifyCode===code;
    const isCodeNotExpired=new Date(user.verifyCodeExpiry)> new Date()
    console.log('iscode valid->',isCodeValid);
    console.log(code);
    
    if(isCodeNotExpired&&isCodeValid){
      user.isVerified=true
      await user.save()
      return Response.json({
        success:true,
        message:"Account verified successfully"
      },{status:200})
    }else{
      if(!isCodeNotExpired){
        user.isVerified=true
        await user.save()
        return Response.json({
          success:false,
          message:"Verification Code has Expired, Please sign-up again to get a new code"
        },{status:400})}
      else{
          user.isVerified=true
          await user.save()
          return Response.json({
            success:false,
            message:"Wrong Code"
          },{status:400})
      }

    }

  }catch (error) {
    console.error("Error in verify-code",error)
    return Response.json({
      success:false,
      message:"Error checking username"
    },{
      status:500
    })
  }
}