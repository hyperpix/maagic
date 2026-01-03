"use client"

import React from "react"
import { Node } from "reactflow"
import { AgentNodeData } from "./agent-canvas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AgentNodeConfigProps {
  node: Node<AgentNodeData>
  onUpdateConfig: (config: Record<string, any>) => void
  onClose: () => void
}

export function AgentNodeConfig({
  node,
  onUpdateConfig,
  onClose,
}: AgentNodeConfigProps) {
  const config = node.data.config || {}

  const renderConfig = () => {
    switch (node.data.type) {
      case "llm":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={config.model || "gpt-4o-mini"}
                onValueChange={(val) => onUpdateConfig({ model: val })}
              >
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature || 0.7}
                onChange={(e) =>
                  onUpdateConfig({ temperature: parseFloat(e.target.value) })
                }
              />
              <p className="text-xs text-muted-foreground">
                0 = focused, 2 = creative
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                min="100"
                max="4096"
                value={config.maxTokens || 2048}
                onChange={(e) =>
                  onUpdateConfig({ maxTokens: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        )

      case "knowledge":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-retrieve">Max Retrieve</Label>
              <Input
                id="max-retrieve"
                type="number"
                min="1"
                max="10"
                value={config.maxRetrieve || 3}
                onChange={(e) =>
                  onUpdateConfig({ maxRetrieve: parseInt(e.target.value) })
                }
              />
              <p className="text-xs text-muted-foreground">
                Maximum document chunks to retrieve
              </p>
            </div>
          </div>
        )

      case "api":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">API URL</Label>
              <Input
                id="api-url"
                value={config.url || ""}
                onChange={(e) => onUpdateConfig({ url: e.target.value })}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-method">Method</Label>
              <Select
                value={config.method || "GET"}
                onValueChange={(val) => onUpdateConfig({ method: val })}
              >
                <SelectTrigger id="api-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-muted-foreground">
            No configuration available for this node type.
          </div>
        )
    }
  }

  return (
    <div className="w-80 border-l bg-sidebar flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Node Configuration</h3>
          <p className="text-xs text-muted-foreground mt-1">{node.data.label}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">{renderConfig()}</div>
      </ScrollArea>
    </div>
  )
}

