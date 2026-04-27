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
import { Search, Eye, MoreHorizontal, RefreshCw, Plug, Plus } from "lucide-react"
import { toast } from "sonner"
import type { NormalizedOrder } from "@/lib/integrations/types"

const STATUS_STYLES: Record<string, string> = {
  delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  shipped:    "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
}

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"

const EMPTY_DRAFT = {
  customerName: "",
  customerEmail: "",
  total: "",
  itemCount: "1",
  status: "processing" as OrderStatus,
}

export function OrdersPage({ onGoToIntegrations }: { onGoToIntegrations?: () => void }) {
  const manualOrders = useQuery(api.orders.getOrders)
  const createOrder  = useMutation(api.orders.createOrder)

  const [integrationOrders, setIntegrationOrders] = useState<NormalizedOrder[]>([])
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
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed")
      setIntegrationOrders(data.orders)
      setSource(data.source)
    } catch (e: any) {
      setFetchError(e.message)
    } finally {
      setLoadingIntegration(false)
    }
  }

  useEffect(() => { loadIntegration() }, [])

  // Merge: Convex manual entries + integration entries
  const manualNormalized: NormalizedOrder[] = (manualOrders ?? []).map((o) => ({
    id: o._id,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    total: o.total,
    status: o.status,
    itemCount: o.itemCount,
    date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }))

  const all = [...manualNormalized, ...integrationOrders]
  const loading = manualOrders === undefined || loadingIntegration

  const filtered = all.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`

  const handleCreate = async () => {
    if (!draft.customerName.trim()) { toast.error("Customer name is required"); return }
    const total = parseFloat(draft.total)
    if (isNaN(total) || total < 0) { toast.error("Enter a valid total"); return }
    setSaving(true)
    try {
      await createOrder({
        customerId: crypto.randomUUID(),
        customerName: draft.customerName.trim(),
        customerEmail: draft.customerEmail.trim(),
        total: Math.round(total * 100),
        status: draft.status,
        itemCount: parseInt(draft.itemCount) || 1,
      })
      toast.success("Order created")
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
            placeholder="Search orders…" className="pl-9 h-8 text-sm" />
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
          <Plus className="h-3.5 w-3.5" /> New order
        </Button>
      </div>

      {/* no integration + no manual */}
      {!loading && !fetchError && !source && all.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <Plug className="h-8 w-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground mt-1">Connect an integration or create a manual order.</p>
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
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
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
              {!loading && filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-medium">#{order.id.slice(-6)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="text-muted-foreground">{order.itemCount}</TableCell>
                  <TableCell className="font-medium">{fmt(order.total)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
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
                        <DropdownMenuItem className="gap-2"><Eye className="h-3.5 w-3.5" /> View order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && all.length > 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">No orders match your search.</TableCell>
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
            <DialogTitle>New order</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Customer name <span className="text-destructive">*</span></Label>
              <Input value={draft.customerName} onChange={(e) => setDraft((d) => ({ ...d, customerName: e.target.value }))} placeholder="Emma Wilson" />
            </div>
            <div className="space-y-1.5">
              <Label>Customer email</Label>
              <Input type="email" value={draft.customerEmail} onChange={(e) => setDraft((d) => ({ ...d, customerEmail: e.target.value }))} placeholder="emma@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Total ($) <span className="text-destructive">*</span></Label>
                <Input type="number" min="0" step="0.01" value={draft.total} onChange={(e) => setDraft((d) => ({ ...d, total: e.target.value }))} placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <Label>Item count</Label>
                <Input type="number" min="1" value={draft.itemCount} onChange={(e) => setDraft((d) => ({ ...d, itemCount: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => setDraft((d) => ({ ...d, status: v as OrderStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Creating…" : "Create order"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
