"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Eye, MoreHorizontal, AlertCircle } from "lucide-react"

const PRIORITY_STYLES: Record<string, string> = {
  high:   "bg-red-50 text-red-700 border-red-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  low:    "bg-slate-50 text-slate-600 border-slate-200",
}

const STATUS_STYLES: Record<string, string> = {
  open:        "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-purple-50 text-purple-700 border-purple-200",
  resolved:    "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const STATUS_LABELS: Record<string, string> = {
  open:        "Open",
  in_progress: "In Progress",
  resolved:    "Resolved",
}

export function IssuesPage() {
  const issues = useQuery(api.issues.getIssues)
  const [search, setSearch] = useState("")

  const loading = issues === undefined

  const filtered = (issues ?? []).filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.customerName.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search issues…" className="pl-9 h-8 text-sm" />
      </div>

      {!loading && issues.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-foreground">No issues yet</p>
            <p className="text-xs text-muted-foreground mt-1">Issues created by visitors or agents will appear here.</p>
          </div>
        </div>
      )}

      {(loading || issues.length > 0) && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!loading && filtered.map((issue) => (
                <TableRow key={issue._id}>
                  <TableCell className="font-medium max-w-xs truncate">{issue.title}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-foreground">{issue.customerName}</p>
                      {issue.customerEmail && (
                        <p className="text-xs text-muted-foreground">{issue.customerEmail}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLES[issue.priority]}`}>
                      {issue.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[issue.status]}`}>
                      {STATUS_LABELS[issue.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmt(issue.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-3.5 w-3.5" /> View issue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && issues.length > 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    No issues match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
