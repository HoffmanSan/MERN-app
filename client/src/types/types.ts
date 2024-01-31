// GLOBAL TYPES
export type Category = {
  _id: string
  name: string
  cloudinaryFolderId: string
  imageURL: string
} 

export type NewProduct = {
  _id?: string
  name: string
  price: number
  description: string
  inStock: number
  categories: string[]
  photoURLs: string[]
  cloudinaryFolderId: string
}

export type Product = NewProduct & {
  _id: string
  createdAt: Date
}

export type User = {
  email: string
  createdAt: Date
  _id: string
  role: string
}

export type CartItem = {
  cartItemId: string
  cartItemQuantity: number
}
