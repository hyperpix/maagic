"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Conversation {
  _id: string
  visitorId: string
  createdAt: number
  openedAt?: number
  lastMessage: {
    content: string
    createdAt: number
  } | null
}

interface ConversationsDataTableProps {
  data: Conversation[]
  onRowClick: (conversationId: string) => void
  getInitials: (visitorId: string) => string
  truncateMessage: (text: string, maxLength?: number) => string
  formatTime: (timestamp: number) => string
  isLoading?: boolean
  selectedId?: string | null
}

export function ConversationsDataTable({
  data,
  onRowClick,
  getInitials,
  truncateMessage,
  formatTime,
  isLoading = false,
  selectedId = null,
}: ConversationsDataTableProps) {
  const columns = React.useMemo<ColumnDef<Conversation>[]>(
    () => [
      {
        accessorKey: "visitorId",
        header: "",
        cell: ({ row }) => {
          const conv = row.original
          return (
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={conv.visitorId} />
                <AvatarFallback className="text-sm">
                  {getInitials(conv.visitorId)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground/90">{conv.visitorId}</span>
                <div className="text-sm font-normal truncate max-w-md text-muted-foreground/80">
                  {conv.lastMessage
                    ? truncateMessage(conv.lastMessage.content)
                    : "No messages"}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "time",
        header: "",
        cell: ({ row }) => {
          const conv = row.original
          const isUnopened = !conv.openedAt
          return (
            <div className="flex items-center justify-end gap-2">
              <div className="text-muted-foreground/70 text-sm font-normal">
                {conv.lastMessage
                  ? formatTime(conv.lastMessage.createdAt)
                  : formatTime(conv.createdAt)}
              </div>
              {isUnopened && (
                <div className="h-2 w-2 rounded-full bg-green-500/70" />
              )}
            </div>
          )
        },
      },
    ],
    [getInitials, truncateMessage, formatTime]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden pt-4 pr-4 pb-4 pl-0 h-full flex flex-col">
        <div className="max-w-sm border-r border-border/30 h-full rounded-lg overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <Table>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-muted/30 border-b border-border/20 last:border-b-0 transition-colors"
                  >
                    <TableCell className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col gap-1 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-2 w-2 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex-1 overflow-hidden pt-4 pr-4 pb-4 pl-0 h-full flex flex-col">
        <div className="max-w-sm border-r border-border/30 h-full rounded-lg overflow-hidden flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground text-sm">
              No conversations yet
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden pt-4 pr-4 pb-4 pl-0 h-full flex flex-col">
      <div className="max-w-sm border-r border-border/30 h-full rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/30 border-b border-border/20 last:border-b-0 transition-colors",
                    index === 0 && "first:rounded-t-lg",
                    index === table.getRowModel().rows.length - 1 && "last:rounded-b-lg"
                  )}
                  onClick={() => onRowClick(row.original._id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

