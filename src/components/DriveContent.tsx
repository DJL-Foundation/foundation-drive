"use client"

import { useState, useEffect } from "react"
import type { DriveState, DriveItem } from "../types/drive"
import { mockData } from "../utils/mockData"
import { getItemPath } from "../utils/driveFunctions"
import { Breadcrumb } from "./Breadcrumb"
import { GridLayout } from "./GridLayout"
import { ListLayout } from "./ListLayout"
import { SearchResults } from "./SearchResults"
import { MoveItemModal } from "./MoveItemModal"
import { Pagination } from "./Pagination"
import { toast } from "sonner"
import { FolderOpen } from "lucide-react"
import { RenameDialog } from "./RenameDialog"
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog"

type DriveContentProps = {
  layout: "grid" | "list"
  searchQuery: string
}

export function DriveContent({ layout, searchQuery }: DriveContentProps) {
  const [driveState, setDriveState] = useState<DriveState>(() => ({
    items: mockData,
    currentPath: [],
    layout: "grid",
    currentPage: 1,
    itemsPerPage: 10,
  }))
  const [moveItem, setMoveItem] = useState<DriveItem | null>(null)
  const [renameItem, setRenameItem] = useState<DriveItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<DriveItem | null>(null)

  useEffect(() => {
    if (driveState.currentPage > Math.ceil(currentItems.length / driveState.itemsPerPage)) {
      setDriveState((prevState) => ({ ...prevState, currentPage: 1 }))
    }
  }, [driveState.itemsPerPage, driveState.currentPage]) // Removed driveState.currentPath from dependencies

  const getCurrentFolderId = (): string | null => {
    if (driveState.currentPath.length === 0) return null
    const currentFolder = driveState.items.find(
      (item) => item.name === driveState.currentPath[driveState.currentPath.length - 1] && !("mimeType" in item),
    )
    return currentFolder ? currentFolder.id : null
  }

  const currentItems: DriveItem[] = driveState.items.filter((item) => item.parent === getCurrentFolderId())

  const paginatedItems = currentItems.slice(
    (driveState.currentPage - 1) * driveState.itemsPerPage,
    driveState.currentPage * driveState.itemsPerPage,
  )

  const searchResults: (DriveItem & { path: string[] })[] = searchQuery
    ? driveState.items
        .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((item) => ({
          ...item,
          path: getItemPath(driveState.items, item.id),
        }))
    : []

  const handleItemClick = (item: DriveItem) => {
    if (!("mimeType" in item)) {
      const path = getItemPath(driveState.items, item.id)
      setDriveState((prevState) => ({
        ...prevState,
        currentPath: path,
        currentPage: 1,
      }))
    }
  }

  const handleBreadcrumbNavigate = (index: number) => {
    setDriveState((prevState) => ({
      ...prevState,
      currentPath: index === -1 ? [] : prevState.currentPath.slice(0, index + 1),
      currentPage: 1,
    }))
  }

  const handleItemAction = (action: string, item: DriveItem) => {
    switch (action) {
      case "rename":
        setRenameItem(item)
        break
      case "move":
        setMoveItem(item)
        break
      case "delete":
        setDeleteItem(item)
        break
      case "download":
        // Implement download functionality
        break
      case "toggleVisibility":
        setDriveState((prevState) => ({
          ...prevState,
          items: prevState.items.map((i) =>
            i.id === item.id ? { ...i, visibility: i.visibility === "public" ? "private" : "public" } : i,
          ),
        }))
        toast.success(`${item.name} is now ${item.visibility === "public" ? "private" : "public"}`)
        break
    }
  }

  const handleMoveItem = (targetFolderId: string | null) => {
    if (moveItem) {
      setDriveState((prevState) => ({
        ...prevState,
        items: prevState.items.map((item) => (item.id === moveItem.id ? { ...item, parent: targetFolderId } : item)),
      }))
      setMoveItem(null)
      toast.success(`${moveItem.name} has been moved successfully`)
    }
  }

  const calculateFolderSize = (folderId: string): number => {
    const folderItems = driveState.items.filter((item) => item.parent === folderId)
    return folderItems.reduce((total, item) => {
      if ("mimeType" in item) {
        return total + item.size
      } else {
        return total + calculateFolderSize(item.id)
      }
    }, 0)
  }

  const handleGoBack = () => {
    setDriveState((prevState) => ({
      ...prevState,
      currentPath: prevState.currentPath.slice(0, -1),
      currentPage: 1,
    }))
  }

  const handleRename = (newName: string) => {
    if (renameItem) {
      setDriveState((prevState) => ({
        ...prevState,
        items: prevState.items.map((item) => (item.id === renameItem.id ? { ...item, name: newName } : item)),
      }))
      setRenameItem(null)
      toast.success(`${renameItem.name} has been renamed to ${newName}`)
    }
  }

  const handleDelete = () => {
    if (deleteItem) {
      setDriveState((prevState) => ({
        ...prevState,
        items: prevState.items.filter((item) => item.id !== deleteItem.id),
      }))
      setDeleteItem(null)
      toast.success(`${deleteItem.name} has been deleted`)
    }
  }

  return (
    <div className="p-4">
      <Breadcrumb path={driveState.currentPath} onNavigate={handleBreadcrumbNavigate} />
      {driveState.currentPath.length > 0 && (
        <button className="mt-2 mb-4 text-blue-400 hover:underline" onClick={handleGoBack}>
          Go Back
        </button>
      )}
      {searchQuery ? (
        <SearchResults
          results={searchResults}
          layout={layout}
          onItemClick={handleItemClick}
          onItemAction={handleItemAction}
        />
      ) : (
        <>
          {currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FolderOpen size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-400 text-lg">Nothing to be found here</p>
            </div>
          ) : (
            <>
              {layout === "grid" ? (
                <GridLayout items={paginatedItems} onItemClick={handleItemClick} onItemAction={handleItemAction} />
              ) : (
                <ListLayout items={paginatedItems} onItemClick={handleItemClick} onItemAction={handleItemAction} />
              )}
              <Pagination
                currentPage={driveState.currentPage}
                totalItems={currentItems.length}
                itemsPerPage={driveState.itemsPerPage}
                onPageChange={(page) => setDriveState((prevState) => ({ ...prevState, currentPage: page }))}
                onItemsPerPageChange={(count) =>
                  setDriveState((prevState) => ({ ...prevState, itemsPerPage: count, currentPage: 1 }))
                }
              />
            </>
          )}
        </>
      )}
      {moveItem && (
        <MoveItemModal
          item={moveItem}
          folders={driveState.items.filter((item) => !("mimeType" in item))}
          onMove={handleMoveItem}
          onClose={() => setMoveItem(null)}
        />
      )}
      {renameItem && <RenameDialog item={renameItem} onRename={handleRename} onClose={() => setRenameItem(null)} />}
      {deleteItem && (
        <DeleteConfirmationDialog
          itemName={deleteItem.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  )
}

