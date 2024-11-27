import { Message } from "@/model/User.model";

export interface apiResponse{
  success:boolean;
  statusCode:number;
  message:string;
  isAcceptingMessages?:boolean;
  messages?:Array<Message>
}