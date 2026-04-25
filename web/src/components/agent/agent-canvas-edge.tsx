"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow"

export function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  animated,
  selected,
  markerEnd,
  style,
}: EdgeProps) {
  const { setEdges } = useReactFlow()
  const [editing, setEditing] = useState(false)
  const [currentLabel, setCurrentLabel] = useState((label as string) || "")
  const inputRef = useRef<HTMLInputElement>(null)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commitLabel = () => {
    setEdges((eds) =>
      eds.map((e) => (e.id === id ? { ...e, label: currentLabel } : e))
    )
    setEditing(false)
  }

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEdges((eds) => eds.filter((e) => e.id !== id))
  }

  const edgeColor = animated ? "#6366f1" : "#94a3b8"

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: edgeColor,
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: animated ? "6 3" : undefined,
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan flex items-center gap-1"
        >
          {/* Label (only shown if conditional/animated or has a label) */}
          {animated &&
            (editing ? (
              <input
                ref={inputRef}
                value={currentLabel}
                onChange={(e) => setCurrentLabel(e.target.value)}
                onBlur={commitLabel}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === "Enter") commitLabel()
                  if (e.key === "Escape") {
                    setCurrentLabel((label as string) || "")
                    setEditing(false)
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border border-input rounded-full px-3 py-0.5 text-xs outline-none focus:ring-1 focus:ring-ring min-w-[60px] text-center"
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditing(true)
                }}
                className="bg-background border border-indigo-300 text-indigo-700 rounded-full px-3 py-0.5 text-xs hover:bg-indigo-50 transition-colors whitespace-nowrap"
              >
                {currentLabel || "add condition"}
              </button>
            ))}

          {/* Delete button — always present on hover/select */}
          {selected && (
            <button
              onClick={onDelete}
              className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              ×
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
