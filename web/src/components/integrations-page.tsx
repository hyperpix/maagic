"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ShoppingCart, Globe, Database, Zap, Check, Trash2, ChevronDown, ChevronUp } from "lucide-react"

/* ─── platform definitions ───────────────────────────────────────────────── */

type PlatformType = "shopify" | "woocommerce" | "postgres" | "rest_api"

interface Platform {
  type: PlatformType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[]
}

const PLATFORMS: Platform[] = [
  {
    type: "shopify",
    label: "Shopify",
    description: "Connect your Shopify store to sync orders and products.",
    icon: ShoppingCart,
    accent: "#96bf48",
    fields: [
      { key: "shopDomain",   label: "Shop domain",    placeholder: "my-store.myshopify.com" },
      { key: "accessToken",  label: "Access token",   placeholder: "shpat_xxxxxxxxxxxx", secret: true },
    ],
  },
  {
    type: "woocommerce",
    label: "WooCommerce",
    description: "Connect your WooCommerce store via REST API credentials.",
    icon: Globe,
    accent: "#7f54b3",
    fields: [
      { key: "siteUrl",        label: "Site URL",        placeholder: "https://mystore.com" },
      { key: "consumerKey",    label: "Consumer key",    placeholder: "ck_xxxxxxxxxxxx", secret: true },
      { key: "consumerSecret", label: "Consumer secret", placeholder: "cs_xxxxxxxxxxxx", secret: true },
    ],
  },
  {
    type: "postgres",
    label: "PostgreSQL",
    description: "Connect directly to a PostgreSQL database (Neon, Supabase, etc.).",
    icon: Database,
    accent: "#336791",
    fields: [
      { key: "connectionString", label: "Connection string", placeholder: "postgresql://user:pass@host/db", secret: true },
      { key: "ordersTable",      label: "Orders table",      placeholder: "orders (default)" },
      { key: "itemsTable",       label: "Items table",       placeholder: "items (default)" },
    ],
  },
  {
    type: "rest_api",
    label: "REST API",
    description: "Connect any custom REST API that returns orders and items.",
    icon: Zap,
    accent: "#f97316",
    fields: [
      { key: "baseUrl",     label: "Base URL",    placeholder: "https://api.mystore.com" },
      { key: "apiKey",      label: "API key",     placeholder: "Optional Bearer token", secret: true },
      { key: "ordersPath",  label: "Orders path", placeholder: "/orders (default)" },
      { key: "itemsPath",   label: "Items path",  placeholder: "/items (default)" },
    ],
  },
]

/* ─── component ──────────────────────────────────────────────────────────── */

export function IntegrationsPage() {
  const integrations = useQuery(api.integrations.getIntegrations)
  const saveIntegration = useMutation(api.integrations.saveIntegration)
  const setActive = useMutation(api.integrations.setActiveIntegration)
  const deleteIntegration = useMutation(api.integrations.deleteIntegration)

  const [expanded, setExpanded] = useState<PlatformType | null>(null)
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState<PlatformType | null>(null)

  const connected = (type: PlatformType) => integrations?.find((i) => i.type === type)
  const active = integrations?.find((i) => i.active)

  const setField = (type: PlatformType, key: string, val: string) =>
    setDrafts((d) => ({ ...d, [type]: { ...(d[type] ?? {}), [key]: val } }))

  const handleSave = async (platform: Platform) => {
    const config = drafts[platform.type] ?? {}
    const required = platform.fields.filter((f) => !f.placeholder.includes("default"))
    if (required.some((f) => !config[f.key]?.trim())) {
      toast.error("Fill in all required fields.")
      return
    }
    setSaving(platform.type)
    try {
      await saveIntegration({ type: platform.type, name: platform.label, config: JSON.stringify(config) })
      toast.success(`${platform.label} connected`)
      setExpanded(null)
      setDrafts((d) => { const n = { ...d }; delete n[platform.type]; return n })
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (id: string, label: string) => {
    await deleteIntegration({ id: id as any })
    toast.success(`${label} disconnected`)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-4 max-w-2xl">
      <div>
        <p className="text-sm text-muted-foreground">Connect your merchant platforms to pull live orders and inventory into Maagic.</p>
      </div>

      {PLATFORMS.map((platform) => {
        const { type, label, description, icon: Icon, accent, fields } = platform
        const conn = connected(type)
        const isActive = active?.type === type
        const isExpanded = expanded === type

        return (
          <div key={type} className="rounded-xl border border-border overflow-hidden">
            {/* header row */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-background">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${accent}18`, color: accent }}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                  {conn && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                      <Check className="h-2.5 w-2.5" />
                      Connected
                    </Badge>
                  )}
                  {isActive && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-emerald-500 text-white hover:bg-emerald-500">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {conn && !isActive && (
                  <Button variant="outline" size="sm" className="h-7 text-xs"
                    onClick={() => { setActive({ id: conn._id }); toast.success(`${label} set as active`) }}>
                    Set active
                  </Button>
                )}
                {conn && (
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(conn._id, label)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => setExpanded(isExpanded ? null : type)}>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* credentials form */}
            {isExpanded && (
              <div className="px-4 py-4 border-t border-border bg-muted/30 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {fields.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">{f.label}</Label>
                      <Input
                        type={f.secret ? "password" : "text"}
                        placeholder={f.placeholder}
                        value={drafts[type]?.[f.key] ?? ""}
                        onChange={(e) => setField(type, f.key, e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="ghost" size="sm" className="h-7 text-xs"
                    onClick={() => setExpanded(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="h-7 text-xs"
                    disabled={saving === type}
                    onClick={() => handleSave(platform)}>
                    {saving === type ? "Connecting…" : conn ? "Update" : "Connect"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
