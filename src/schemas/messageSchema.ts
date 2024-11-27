import { z } from "zod";


export const messagesSchema = z.object({
  content:z.string()
  .min(4,{message:"Message must be at least of 4 characters"})
  .max(400,{message:"Message can not be longer than 400 characters"})
})