import { object, z } from "zod";

export const signInSchema = object({
  identifier:z.string()
  ,password:z.string()
})