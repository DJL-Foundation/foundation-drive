import { useState } from "react"
import type { DriveItem } from "../types/drive"
import { Folder, ChevronLeft } from "lucide-react"

type MoveItemModalProps = {
  item: DriveItem
  folders: DriveItem[]
  onMove: (targetFolderId: string | null) => void
  onClose: () => void
}

export function MoveItemModal({ item, folders, onMove, onClose }: MoveItemModalProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(item.parent)

  const currentFolders = folders.filter((folder) => folder.parent === currentFolderId)
  const currentPath = getCurrentPath(folders, currentFolderId)

  function getCurrentPath(folders: DriveItem[], folderId: string | null): string[] {
    if (!folderId) return []
    const folder = folders.find((f) => f.id === folderId)
    if (!folder) return []
    return [...getCurrentPath(folders, folder.parent), folder.name]
  }

  const handleMove = () => {
    onMove(currentFolderId)
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId)
  }

  const handleGoBack = () => {
    const parentFolder = folders.find((f) => f.id === currentFolderId)
    setCurrentFolderId(parentFolder ? parentFolder.parent : null)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Move "{item.name}"</h2>
        <div className="flex items-center mb-4">
          <button
            className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
            onClick={handleGoBack}
            disabled={!currentFolderId}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="ml-2 text-gray-400">{currentPath.join(" / ") || "Root"}</span>
        </div>
        <div className="max-h-60 overflow-y-auto mb-4">
          {currentFolders.length === 0 ? (
            <div className="text-center text-gray-400">Select {currentPath[currentPath.length - 1] || "Root"}?</div>
          ) : (
            currentFolders.map((folder) => (
              <button
                key={folder.id}
                className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 text-left"
                onClick={() => handleFolderClick(folder.id)}
              >
                <Folder className="mr-2" size={20} />
                {folder.name}
              </button>
            ))
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleMove}>
            Move Here
          </button>
        </div>
      </div>
    </div>
  )
}

