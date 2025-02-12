"use client"

import { useEffect, useRef, useState } from "react"
import type { DriveItem } from "../types/drive"

type ContextMenuProps = {
  x: number
  y: number
  onClose: () => void
  onAction: (action: string) => void
  item: DriveItem
}

export function ContextMenu({ x, y, onClose, onAction, item }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState({ x, y })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleResize = () => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect()
        const newX = x + rect.width > window.innerWidth ? x - rect.width : x
        const newY = y + rect.height > window.innerHeight ? y - rect.height : y
        setMenuPosition({ x: newX, y: newY })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", handleResize)
    }
  }, [onClose, x, y])

  const menuItems = [
    { label: "Rename", action: "rename" },
    { label: "Move", action: "move" },
    { label: "Delete", action: "delete" },
    ...("mimeType" in item ? [{ label: "Download", action: "download" }] : []),
    { label: item.visibility === "public" ? "Make Private" : "Make Public", action: "toggleVisibility" },
  ]

  return (
    <div
      ref={menuRef}
      className="absolute bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50"
      style={{ top: menuPosition.y, left: menuPosition.x }}
    >
      {menuItems.map((menuItem) => (
        <button
          key={menuItem.action}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-300"
          onClick={() => onAction(menuItem.action)}
        >
          {menuItem.label}
        </button>
      ))}
    </div>
  )
}

