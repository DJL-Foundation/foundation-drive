"use client"

import { useState } from "react"

type CreateFolderModalProps = {
  onClose: () => void
  onCreateFolder: (name: string) => void
}

export function CreateFolderModal({ onClose, onCreateFolder }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (folderName.trim()) {
      onCreateFolder(folderName.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder Name"
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

