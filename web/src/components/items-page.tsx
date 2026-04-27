"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Search, Package, Eye, MoreHorizontal, RefreshCw, Plug, Plus } from "lucide-react"
import { toast } from "sonner"
import type { NormalizedItem } from "@/lib/integrations/types"

const STATUS_STYLES: Record<string, string> = {
  in_stock:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  low_stock:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  out_of_stock: "bg-red-50 text-red-700 border-red-200",
}

const STATUS_LABELS: Record<string, string> = {
  in_stock:     "In Stock",
  low_stock:    "Low Stock",
  out_of_stock: "Out of Stock",
}

type ItemStatus = "in_stock" | "low_stock" | "out_of_stock"

const EMPTY_DRAFT = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "0",
  status: "in_stock" as ItemStatus,
}

export function ItemsPage({ onGoToIntegrations }: { onGoToIntegrations?: () => void }) {
  const manualItems = useQuery(api.items.getItems)
  const createItem  = useMutation(api.items.createItem)

  const [integrationItems, setIntegrationItems] = useState<NormalizedItem[]>([])
  const [source, setSource] = useState<string | null>(null)
  const [loadingIntegration, setLoadingIntegration] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)

  const loadIntegration = async () => {
    setLoadingIntegration(true)
    setFetchError(null)
    try {
      const res = await fetch("/api/items")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed")
      setIntegrationItems(data.items)
      setSource(data.source)
    } catch (e: any) {
      setFetchError(e.message)
    } finally {
      setLoadingIntegration(false)
    }
  }

  useEffect(() => { loadIntegration() }, [])

  // Merge Convex manual items + integration items
  const manualNormalized: NormalizedItem[] = (manualItems ?? []).map((i) => ({
    id: i._id,
    name: i.name,
    sku: i.sku,
    category: i.category,
    price: i.price,
    stock: i.stock,
    status: i.status,
  }))

  const all = [...manualNormalized, ...integrationItems]
  const loading = manualItems === undefined || loadingIntegration

  const filtered = all.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`

  const handleCreate = async () => {
    if (!draft.name.trim()) { toast.error("Item name is required"); return }
    if (!draft.sku.trim())  { toast.error("SKU is required"); return }
    const price = parseFloat(draft.price)
    if (isNaN(price) || price < 0) { toast.error("Enter a valid price"); return }
    setSaving(true)
    try {
      await createItem({
        name: draft.name.trim(),
        sku: draft.sku.trim(),
        category: draft.category.trim() || "Uncategorized",
        price: Math.round(price * 100),
        stock: parseInt(draft.stock) || 0,
        status: draft.status,
      })
      toast.success("Item created")
      setDialogOpen(false)
      setDraft(EMPTY_DRAFT)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-4">
      {/* toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…" className="pl-9 h-8 text-sm" />
        </div>
        {source && (
          <span className="text-xs text-muted-foreground capitalize hidden sm:block">
            Source: <span className="font-medium text-foreground">{source.replace("_", " ")}</span>
          </span>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={loadIntegration} disabled={loadingIntegration}>
          <RefreshCw className={`h-3.5 w-3.5 ${loadingIntegration ? "animate-spin" : ""}`} />
        </Button>
        <Button size="sm" className="h-8 gap-1.5 shrink-0" onClick={() => setDialogOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> New item
        </Button>
      </div>

      {/* empty state */}
      {!loading && !fetchError && !source && all.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <Plug className="h-8 w-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-foreground">No items yet</p>
            <p className="text-xs text-muted-foreground mt-1">Connect an integration or create a manual item.</p>
          </div>
          {onGoToIntegrations && (
            <Button size="sm" variant="outline" className="mt-2" onClick={onGoToIntegrations}>
              Connect integration
            </Button>
          )}
        </div>
      )}

      {fetchError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {fetchError}
        </div>
      )}

      {(loading || all.length > 0) && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground text-sm">Loading…</TableCell>
                </TableRow>
              )}
              {!loading && filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted border border-border">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{item.sku}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="font-medium">{fmt(item.price)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.stock}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Eye className="h-3.5 w-3.5" /> View item</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && all.length > 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">No items match your search.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Wireless Headphones Pro" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>SKU <span className="text-destructive">*</span></Label>
                <Input value={draft.sku} onChange={(e) => setDraft((d) => ({ ...d, sku: e.target.value }))} placeholder="WHP-9001" />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} placeholder="Electronics" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Price ($) <span className="text-destructive">*</span></Label>
                <Input type="number" min="0" step="0.01" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <Label>Stock</Label>
                <Input type="number" min="0" value={draft.stock} onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => setDraft((d) => ({ ...d, status: v as ItemStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Creating…" : "Create item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
