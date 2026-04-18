import { z } from "zod"

const OrderItemSchema = z.object({
  productId: z.string().uuid().describe("Referenced product"),
  quantity:  z.number().int().min(1).max(10).describe("Item quantity"),
  price:     z.number().min(0.01).max(99999).describe("Unit price at time of order"),
})

export const OrderSchema = z.object({
  id:          z.string().uuid().describe("Unique order identifier"),
  userId:      z.string().uuid().describe("Ordering user"),
  status:      z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).describe("Order lifecycle status"),
  totalAmount: z.number().min(0.01).max(999999).describe("Order total (sum of items)"),
  currency:    z.enum(["USD", "EUR", "KRW"]).describe("Currency code"),
  items:       z.array(OrderItemSchema).describe("Line items"),
  createdAt:   z.string().datetime().describe("ISO 8601 creation timestamp"),
})

export type Order = z.infer<typeof OrderSchema>
