import { z } from "zod"
import { UserSchema }    from "./user"
import { ProductSchema } from "./product"
import { OrderSchema }   from "./order"

// Central schema registry — used by both the CLI and the React demo.
export const SCHEMAS: Record<string, z.AnyZodObject> = {
  User:    UserSchema,
  Product: ProductSchema,
  Order:   OrderSchema,
}

export { UserSchema, ProductSchema, OrderSchema }
export type { User }    from "./user"
export type { Product } from "./product"
export type { Order }   from "./order"
