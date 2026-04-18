// Static source-code strings shown in the React demo and CLI pipeline view.
// Kept in sync with the actual model files — update both if you change a schema.
export const SCHEMA_SOURCE: Record<string, string> = {
  User: `import { z } from "zod"

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

// TypeScript type derived for free — no separate interface needed
export type User = z.infer<typeof UserSchema>`,

  Product: `import { z } from "zod"

export const ProductSchema = z.object({
  id:          z.string().uuid().describe("Unique product identifier"),
  name:        z.string().describe("Product name"),
  description: z.string().describe("Full product description"),
  price:       z.number().min(0.01).max(99999).describe("Price (excluding tax)"),
  currency:    z.enum(["USD", "EUR", "KRW"]).describe("Currency code"),
  category:    z.enum(["electronics", "clothing", "food", "books"]),
  inStock:     z.boolean().describe("Inventory availability"),
  tags:        z.array(z.string()).describe("Searchable tags"),
  createdAt:   z.string().datetime().describe("ISO 8601 creation timestamp"),
})

export type Product = z.infer<typeof ProductSchema>`,

  Order: `import { z } from "zod"

const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity:  z.number().int().min(1).max(10),
  price:     z.number().min(0.01).max(99999),
})

export const OrderSchema = z.object({
  id:          z.string().uuid(),
  userId:      z.string().uuid(),
  status:      z.enum(["pending", "confirmed",
                       "shipped", "delivered", "cancelled"]),
  totalAmount: z.number().min(0.01).max(999999),
  currency:    z.enum(["USD", "EUR", "KRW"]),
  items:       z.array(OrderItemSchema).describe("Line items"),
  createdAt:   z.string().datetime(),
})

export type Order = z.infer<typeof OrderSchema>`,
}
