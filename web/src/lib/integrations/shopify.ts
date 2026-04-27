import type { ShopifyConfig, NormalizedOrder, NormalizedItem } from "./types"

const STATUS_MAP: Record<string, NormalizedOrder["status"]> = {
  pending:    "processing",
  open:       "processing",
  fulfilled:  "delivered",
  unfulfilled:"processing",
  shipped:    "shipped",
  cancelled:  "cancelled",
  refunded:   "cancelled",
}

function shopifyFetch(config: ShopifyConfig, path: string) {
  return fetch(`https://${config.shopDomain}/admin/api/2024-01/${path}`, {
    headers: {
      "X-Shopify-Access-Token": config.accessToken,
      "Content-Type": "application/json",
    },
  })
}

export async function fetchShopifyOrders(config: ShopifyConfig): Promise<NormalizedOrder[]> {
  const res = await shopifyFetch(config, "orders.json?limit=50&status=any")
  if (!res.ok) throw new Error(`Shopify orders error: ${res.status}`)
  const { orders } = await res.json()
  return orders.map((o: any) => ({
    id: String(o.id),
    customerName: o.billing_address
      ? `${o.billing_address.first_name} ${o.billing_address.last_name}`.trim()
      : o.email ?? "Unknown",
    customerEmail: o.email ?? "",
    total: Math.round(parseFloat(o.total_price) * 100),
    status: STATUS_MAP[o.financial_status] ?? STATUS_MAP[o.fulfillment_status ?? ""] ?? "processing",
    itemCount: o.line_items?.length ?? 0,
    date: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }))
}

export async function fetchShopifyItems(config: ShopifyConfig): Promise<NormalizedItem[]> {
  const res = await shopifyFetch(config, "products.json?limit=50")
  if (!res.ok) throw new Error(`Shopify products error: ${res.status}`)
  const { products } = await res.json()
  const items: NormalizedItem[] = []
  for (const p of products) {
    for (const v of p.variants ?? []) {
      const stock = v.inventory_quantity ?? 0
      items.push({
        id: String(v.id),
        name: p.variants.length > 1 ? `${p.title} – ${v.title}` : p.title,
        sku: v.sku || `shopify-${v.id}`,
        category: p.product_type || "Uncategorized",
        price: Math.round(parseFloat(v.price) * 100),
        stock,
        status: stock === 0 ? "out_of_stock" : stock <= 5 ? "low_stock" : "in_stock",
      })
    }
  }
  return items
}
