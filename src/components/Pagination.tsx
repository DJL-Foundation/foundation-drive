import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (count: number) => void
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalItems <= 10) {
    return null
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-2">
        <span className="text-gray-400">
          Page {currentPage} of{" "}
          <select
            className="bg-transparent text-white"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

