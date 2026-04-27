import type { RestApiConfig, NormalizedOrder, NormalizedItem } from "./types"

const STATUS_MAP: Record<string, NormalizedOrder["status"]> = {
  processing: "processing",
  pending:    "processing",
  shipped:    "shipped",
  delivered:  "delivered",
  completed:  "delivered",
  cancelled:  "cancelled",
  canceled:   "cancelled",
}

function restFetch(config: RestApiConfig, path: string) {
  const base = config.baseUrl.replace(/\/$/, "")
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (config.apiKey) headers["Authorization"] = `Bearer ${config.apiKey}`
  return fetch(`${base}${path}`, { headers })
}

export async function fetchRestOrders(config: RestApiConfig): Promise<NormalizedOrder[]> {
  const path = config.ordersPath ?? "/orders"
  const res = await restFetch(config, path)
  if (!res.ok) throw new Error(`REST orders error: ${res.status}`)
  const data = await res.json()
  const orders: any[] = Array.isArray(data) ? data : data.orders ?? data.data ?? []
  return orders.map((o: any) => ({
    id: String(o.id),
    customerName: o.customer_name ?? o.customerName ?? o.name ?? "Unknown",
    customerEmail: o.customer_email ?? o.customerEmail ?? o.email ?? "",
    total: typeof o.total === "number" ? Math.round(o.total * 100) : Math.round(parseFloat(o.total ?? "0") * 100),
    status: STATUS_MAP[o.status?.toLowerCase()] ?? "processing",
    itemCount: o.item_count ?? o.itemCount ?? o.items?.length ?? 0,
    date: o.created_at ?? o.createdAt ?? o.date
      ? new Date(o.created_at ?? o.createdAt ?? o.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
  }))
}

export async function fetchRestItems(config: RestApiConfig): Promise<NormalizedItem[]> {
  const path = config.itemsPath ?? "/items"
  const res = await restFetch(config, path)
  if (!res.ok) throw new Error(`REST items error: ${res.status}`)
  const data = await res.json()
  const items: any[] = Array.isArray(data) ? data : data.items ?? data.products ?? data.data ?? []
  return items.map((i: any) => {
    const stock = i.stock ?? i.stock_quantity ?? i.inventory ?? 0
    return {
      id: String(i.id),
      name: i.name ?? i.title ?? "",
      sku: i.sku ?? `api-${i.id}`,
      category: i.category ?? i.type ?? "Uncategorized",
      price: typeof i.price === "number" ? Math.round(i.price * 100) : Math.round(parseFloat(i.price ?? "0") * 100),
      stock,
      status: stock === 0 ? "out_of_stock" : stock <= 5 ? "low_stock" : "in_stock",
    }
  })
}
