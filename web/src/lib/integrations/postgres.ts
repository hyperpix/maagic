import type { PostgresConfig, NormalizedOrder, NormalizedItem } from "./types"

// Dynamically imported so it only loads server-side
async function getPool(connectionString: string) {
  const { Pool } = await import("pg")
  return new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
}

const STATUS_MAP: Record<string, NormalizedOrder["status"]> = {
  processing: "processing",
  pending:    "processing",
  shipped:    "shipped",
  delivered:  "delivered",
  cancelled:  "cancelled",
  canceled:   "cancelled",
  refunded:   "cancelled",
}

export async function fetchPostgresOrders(config: PostgresConfig): Promise<NormalizedOrder[]> {
  const pool = await getPool(config.connectionString)
  const table = config.ordersTable ?? "orders"
  const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY created_at DESC LIMIT 100`)
  await pool.end()
  return rows.map((r: any) => ({
    id: String(r.id),
    customerName: r.customer_name ?? r.name ?? `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim(),
    customerEmail: r.customer_email ?? r.email ?? "",
    total: typeof r.total === "number" ? Math.round(r.total * 100) : Math.round(parseFloat(r.total ?? "0") * 100),
    status: STATUS_MAP[r.status?.toLowerCase()] ?? "processing",
    itemCount: r.item_count ?? r.items_count ?? 0,
    date: r.created_at
      ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
  }))
}

export async function fetchPostgresItems(config: PostgresConfig): Promise<NormalizedItem[]> {
  const pool = await getPool(config.connectionString)
  const table = config.itemsTable ?? "items"
  const { rows } = await pool.query(`SELECT * FROM ${table} LIMIT 200`)
  await pool.end()
  return rows.map((r: any) => {
    const stock = r.stock ?? r.stock_quantity ?? r.inventory ?? 0
    return {
      id: String(r.id),
      name: r.name ?? r.title ?? "",
      sku: r.sku ?? `pg-${r.id}`,
      category: r.category ?? r.product_type ?? "Uncategorized",
      price: typeof r.price === "number" ? Math.round(r.price * 100) : Math.round(parseFloat(r.price ?? "0") * 100),
      stock,
      status: stock === 0 ? "out_of_stock" : stock <= 5 ? "low_stock" : "in_stock",
    }
  })
}
