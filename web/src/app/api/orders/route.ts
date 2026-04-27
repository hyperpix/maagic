import { NextResponse } from "next/server"
import { fetchShopifyOrders } from "@/lib/integrations/shopify"
import { fetchWooOrders } from "@/lib/integrations/woocommerce"
import { fetchPostgresOrders } from "@/lib/integrations/postgres"
import { fetchRestOrders } from "@/lib/integrations/rest-api"
import { fetchQuery } from "convex/nextjs"
import { api } from "../../../../convex/_generated/api"
import type { NormalizedOrder } from "@/lib/integrations/types"

export async function GET() {
  try {
    const integration = await fetchQuery(api.integrations.getActiveIntegration, {})

    if (!integration) {
      return NextResponse.json({ orders: [], source: null })
    }

    const config = JSON.parse(integration.config)
    let orders: NormalizedOrder[]

    switch (integration.type) {
      case "shopify":
        orders = await fetchShopifyOrders(config)
        break
      case "woocommerce":
        orders = await fetchWooOrders(config)
        break
      case "postgres":
        orders = await fetchPostgresOrders(config)
        break
      case "rest_api":
        orders = await fetchRestOrders(config)
        break
      default:
        orders = []
    }

    return NextResponse.json({ orders, source: integration.type })
  } catch (err: any) {
    console.error("[/api/orders]", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
