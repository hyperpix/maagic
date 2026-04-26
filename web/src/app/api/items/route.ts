import { NextResponse } from "next/server"
import { fetchShopifyItems } from "@/lib/integrations/shopify"
import { fetchWooItems } from "@/lib/integrations/woocommerce"
import { fetchPostgresItems } from "@/lib/integrations/postgres"
import { fetchRestItems } from "@/lib/integrations/rest-api"
import { fetchQuery } from "convex/nextjs"
import { api } from "../../../../convex/_generated/api"
import type { NormalizedItem } from "@/lib/integrations/types"

export async function GET() {
  try {
    const integration = await fetchQuery(api.integrations.getActiveIntegration, {})

    if (!integration) {
      return NextResponse.json({ items: [], source: null })
    }

    const config = JSON.parse(integration.config)
    let items: NormalizedItem[]

    switch (integration.type) {
      case "shopify":
        items = await fetchShopifyItems(config)
        break
      case "woocommerce":
        items = await fetchWooItems(config)
        break
      case "postgres":
        items = await fetchPostgresItems(config)
        break
      case "rest_api":
        items = await fetchRestItems(config)
        break
      default:
        items = []
    }

    return NextResponse.json({ items, source: integration.type })
  } catch (err: any) {
    console.error("[/api/items]", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
