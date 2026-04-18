export interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  totalAmount: number
  currency: "USD" | "EUR" | "KRW"
  items: OrderItem[]
  createdAt: string
}
