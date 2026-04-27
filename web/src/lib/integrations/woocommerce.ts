import type { WooCommerceConfig, NormalizedOrder, NormalizedItem } from "./types"

const STATUS_MAP: Record<string, NormalizedOrder["status"]> = {
  pending:        "processing",
  processing:     "processing",
  "on-hold":      "processing",
  completed:      "delivered",
  shipped:        "shipped",
  cancelled:      "cancelled",
  refunded:       "cancelled",
  failed:         "cancelled",
}

function wooFetch(config: WooCommerceConfig, path: string) {
  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64")
  const base = config.siteUrl.replace(/\/$/, "")
  return fetch(`${base}/wp-json/wc/v3/${path}`, {
    headers: { Authorization: `Basic ${auth}` },
  })
}

export async function fetchWooOrders(config: WooCommerceConfig): Promise<NormalizedOrder[]> {
  const res = await wooFetch(config, "orders?per_page=50")
  if (!res.ok) throw new Error(`WooCommerce orders error: ${res.status}`)
  const orders = await res.json()
  return orders.map((o: any) => ({
    id: String(o.id),
    customerName: `${o.billing?.first_name ?? ""} ${o.billing?.last_name ?? ""}`.trim() || "Guest",
    customerEmail: o.billing?.email ?? "",
    total: Math.round(parseFloat(o.total) * 100),
    status: STATUS_MAP[o.status] ?? "processing",
    itemCount: o.line_items?.length ?? 0,
    date: new Date(o.date_created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }))
}

export async function fetchWooItems(config: WooCommerceConfig): Promise<NormalizedItem[]> {
  const res = await wooFetch(config, "products?per_page=50&status=publish")
  if (!res.ok) throw new Error(`WooCommerce products error: ${res.status}`)
  const products = await res.json()
  return products.map((p: any) => {
    const stock = p.stock_quantity ?? 0
    return {
      id: String(p.id),
      name: p.name,
      sku: p.sku || `woo-${p.id}`,
      category: p.categories?.[0]?.name ?? "Uncategorized",
      price: Math.round(parseFloat(p.price || "0") * 100),
      stock,
      status: p.stock_status === "outofstock" ? "out_of_stock" : stock <= 5 ? "low_stock" : "in_stock",
    }
  })
}
