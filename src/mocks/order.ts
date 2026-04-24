import { type OrderItem, type Order } from "../types/order"

export const mockOrderItem: OrderItem = {
  productId: "fcb448c7-54f5-449d-94b5-7b655dc71590",
  quantity: 68,
  price: 46
}

export const mockOrder: Order = {
  id: "76f4f0d3-c082-4914-96bb-a4e8bb7a1464",
  userId: "a33ba200-7ebd-466b-b6fb-7843f39a2d2b",
  status: "confirmed",
  totalAmount: 15,
  currency: "EUR",
  items: [
    {
      productId: "6aa3d55b-a490-42c5-a84e-046e3f0304df",
      quantity: 23,
      price: 25
    }
  ],
  createdAt: "2026-04-21T16:53:42.415Z"
}