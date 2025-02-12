"use client"

import { useState } from "react"
import { Folder, FileText, Image, File, MoreVertical } from "lucide-react"
import type { DriveItem } from "../types/drive"
import { ContextMenu } from "./ContextMenu"

type ListLayoutProps = {
  items: DriveItem[]
  onItemClick: (item: DriveItem) => void
  onItemAction: (action: string, item: DriveItem) => void
}

export function ListLayout({ items, onItemClick, onItemAction }: ListLayoutProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: DriveItem } | null>(null)

  const getItemIcon = (item: DriveItem) => {
    if (!("mimeType" in item)) return <Folder className="text-yellow-500" />
    if (item.mimeType.startsWith("image/")) return <Image className="text-green-500" />
    if (item.mimeType.includes("document")) return <FileText className="text-blue-500" />
    return <File className="text-gray-500" />
  }

  const formatSize = (size: number) => {
    const units = ["B", "KB", "MB", "GB"]
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`
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
    <div className="mt-4">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-2">Name</th>
            <th className="pb-2">Modified</th>
            <th className="pb-2">Size</th>
            <th className="pb-2">Visibility</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-700 hover:bg-gray-700 rounded-lg cursor-pointer"
              onClick={() => onItemClick(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <td className="py-2 flex items-center">
                {getItemIcon(item)}
                <span className="ml-2 text-gray-300">{item.name}</span>
              </td>
              <td className="py-2 text-gray-400">{new Date(item.modifiedAt).toLocaleDateString()}</td>
              <td className="py-2 text-gray-400">{"size" in item ? formatSize(item.size) : "-"}</td>
              <td className="py-2 text-gray-400">
                {item.visibility === "public" ? (
                  <button
                    className="text-blue-400 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(`https://cdn.example.com/${item.id}`)
                      // Show Sonner notification here
                    }}
                  >
                    Public
                  </button>
                ) : (
                  "Private"
                )}
              </td>
              <td className="py-2 text-right">
                <button
                  className="p-1 rounded-full hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleContextMenu(e, item)
                  }}
                >
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

