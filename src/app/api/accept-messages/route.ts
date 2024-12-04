import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

dbConnect();

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await req.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser)
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        {
          status: 401,
        }
      );
    return Response.json(
      {
        success: true,
        message: `Messages acceptance is updated to ${acceptMessages}`,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("failed to update user status to accept messages", err);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}


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
  const userId = user._id;

  try{
    const foundUser=await UserModel.findById(userId)
    if(!foundUser){
      return Response.json(
      {
        success: false,
        message: "User not found",
      },
      {
        status: 404,
      }
    )}
    return Response.json(
      {
        success: true,
        isAcceptingMessage:foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    )

  }catch (err) {
    console.log("failed to get user", err);
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      {
        status: 500,
      }
    );
  }


}