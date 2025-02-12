"use client"

import { useState } from "react"
import { Search, Grid, List, Upload, FolderPlus, ChevronDown } from "lucide-react"
import { CreateFolderModal } from "./CreateFolderModal"

type HeaderProps = {
  layout: "grid" | "list"
  onLayoutChange: (layout: "grid" | "list") => void
  onSearch: (query: string) => void
  onCreateFolder: (name: string) => void
  onUpload: () => void
}

export function Header({ layout, onLayoutChange, onSearch, onCreateFolder, onUpload }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewMenu, setShowNewMenu] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleCreateFolder = (name: string) => {
    onCreateFolder(name)
    setShowCreateFolderModal(false)
  }

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">DJL-Foundation Drive</h1>
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search in Drive"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </button>
        </form>
        <div className="relative">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center"
            onClick={() => setShowNewMenu(!showNewMenu)}
          >
            New
            <ChevronDown size={16} className="ml-2" />
          </button>
          {showNewMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-700 text-left"
                onClick={() => {
                  setShowNewMenu(false)
                  setShowCreateFolderModal(true)
                }}
              >
                <FolderPlus size={16} className="mr-2" />
                Create Folder
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-700 text-left"
                onClick={() => {
                  setShowNewMenu(false)
                  onUpload()
                }}
              >
                <Upload size={16} className="mr-2" />
                Upload File
              </button>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onLayoutChange("grid")}
            className={`p-2 rounded-full ${layout === "grid" ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => onLayoutChange("list")}
            className={`p-2 rounded-full ${layout === "list" ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>
      {showCreateFolderModal && (
        <CreateFolderModal onClose={() => setShowCreateFolderModal(false)} onCreateFolder={handleCreateFolder} />
      )}
    </header>
  )
}

