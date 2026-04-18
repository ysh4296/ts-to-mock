import { z } from "zod"

export const UserSchema = z.object({
  id:        z.string().uuid().describe("Unique user identifier"),
  name:      z.string().describe("Full name"),
  email:     z.string().email().describe("Primary email address"),
  age:       z.number().int().min(18).max(65).describe("Age in years"),
  role:      z.enum(["admin", "editor", "viewer"]).describe("Access role"),
  isActive:  z.boolean().describe("Account active status"),
  tags:      z.array(z.string()).describe("Optional labels"),
  createdAt: z.string().datetime().describe("ISO 8601 creation timestamp"),
})

export type User = z.infer<typeof UserSchema>
