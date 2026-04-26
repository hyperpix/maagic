export type NormalizedOrder = {
  id: string
  customerName: string
  customerEmail: string
  total: number        // in cents
  status: "processing" | "shipped" | "delivered" | "cancelled"
  itemCount: number
  date: string
}

export type NormalizedItem = {
  id: string
  name: string
  sku: string
  category: string
  price: number        // in cents
  stock: number
  status: "in_stock" | "low_stock" | "out_of_stock"
}

export type ShopifyConfig = {
  shopDomain: string   // e.g. my-store.myshopify.com
  accessToken: string
}

export type WooCommerceConfig = {
  siteUrl: string      // e.g. https://mystore.com
  consumerKey: string
  consumerSecret: string
}

export type PostgresConfig = {
  connectionString: string
  ordersTable?: string // default: orders
  itemsTable?: string  // default: items / products
}

export type RestApiConfig = {
  baseUrl: string
  apiKey?: string
  ordersPath?: string  // default: /orders
  itemsPath?: string   // default: /items
}
