export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: "USD" | "EUR" | "KRW"
  category: "electronics" | "clothing" | "food" | "books"
  inStock: boolean
  tags: string[]
  createdAt: string
}
