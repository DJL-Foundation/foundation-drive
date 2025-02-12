import type { DriveItem } from "../types/drive"
import { Folder, FileText, Image, File } from "lucide-react"

type SearchResultsProps = {
  results: (DriveItem & { path: string[] })[]
  layout: "grid" | "list"
  onItemClick: (item: DriveItem) => void
}

export function SearchResults({ results, layout, onItemClick }: SearchResultsProps) {
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>
      {results.length === 0 ? (
        <p className="text-gray-400">No results found.</p>
      ) : layout === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
              onClick={() => onItemClick(item)}
            >
              {getItemIcon(item)}
              <span className="mt-2 text-sm text-center text-gray-300">{item.name}</span>
              <span className="mt-1 text-xs text-center text-gray-500">{item.path.join(" / ")}</span>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">Name</th>
              <th className="pb-2">Location</th>
              <th className="pb-2">Modified</th>
              <th className="pb-2">Size</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <td className="py-2 flex items-center">
                  {getItemIcon(item)}
                  <span className="ml-2 text-gray-300">{item.name}</span>
                </td>
                <td className="py-2 text-gray-400">{item.path.join(" / ")}</td>
                <td className="py-2 text-gray-400">{new Date(item.modifiedAt).toLocaleDateString()}</td>
                <td className="py-2 text-gray-400">{"size" in item ? formatSize(item.size) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

