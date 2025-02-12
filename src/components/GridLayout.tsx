"use client"

import { useState } from "react"
import { Folder, FileText, Image, File } from "lucide-react"
import type { DriveItem } from "../types/drive"
import { ContextMenu } from "./ContextMenu"

type GridLayoutProps = {
  items: DriveItem[]
  onItemClick: (item: DriveItem) => void
  onItemAction: (action: string, item: DriveItem) => void
}

export function GridLayout({ items, onItemClick, onItemAction }: GridLayoutProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: DriveItem } | null>(null)

  const getItemIcon = (item: DriveItem) => {
    if (!("mimeType" in item)) return <Folder className="text-yellow-500" />
    if (item.mimeType.startsWith("image/")) return <Image className="text-green-500" />
    if (item.mimeType.includes("document")) return <FileText className="text-blue-500" />
    return <File className="text-gray-500" />
  }

  const handleContextMenu = (e: React.MouseEvent, item: DriveItem) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, item })
  }

  const handleAction = (action: string) => {
    if (contextMenu) {
      onItemAction(action, contextMenu.item)
      setContextMenu(null)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
          onClick={() => onItemClick(item)}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          {getItemIcon(item)}
          <span className="mt-2 text-sm text-center text-gray-300">{item.name}</span>
        </div>
      ))}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleAction}
          item={contextMenu.item}
        />
      )}
    </div>
  )
}

