
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcrypt";


export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
          statusCode: 400,
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified){
        return Response.json({
          success: false,
          message: "User already exists with this email",
          statusCode: 400,
        },{status:400})
        
      }
      //todo
    } else {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      // username[with verification] and email is not taken
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser=new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
      });
      await newUser.save()
      // send verification email
      const emailResponse= await sendVerificationEmail(email,username,verifyCode)
      if(!emailResponse.success){
        return Response.json( {
          success: false,
          message: "Error Sending email response->"+emailResponse.message,
          statusCode: 500,
        },
        {
          status: 500,
        })
      }else{
        return Response.json(      {
          success: true,
          message: "Verification email sent, please verify your account",
          statusCode: 500,
        },
        {
          status: 200,
        })

      }
    }
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering User",
        statusCode: 500,
      },
      {
        status: 500,
      }
    );
  }
}
