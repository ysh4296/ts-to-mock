import { z } from "zod"

export const ProductSchema = z.object({
  id:          z.string().uuid().describe("Unique product identifier"),
  name:        z.string().describe("Product name"),
  description: z.string().describe("Full product description"),
  price:       z.number().min(0.01).max(99999).describe("Price (excluding tax)"),
  currency:    z.enum(["USD", "EUR", "KRW"]).describe("Currency code"),
  category:    z.enum(["electronics", "clothing", "food", "books"]).describe("Top-level category"),
  inStock:     z.boolean().describe("Inventory availability"),
  tags:        z.array(z.string()).describe("Searchable tags"),
  createdAt:   z.string().datetime().describe("ISO 8601 creation timestamp"),
})

export type Product = z.infer<typeof ProductSchema>
