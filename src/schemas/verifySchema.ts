import { z } from "zod";

export const verifySchema = z
  .string()
  .length(6, "Verification must be 6 digit long");
