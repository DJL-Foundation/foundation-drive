import { ChevronRight, Home } from "lucide-react"

type BreadcrumbProps = {
  path: string[]
  onNavigate: (index: number) => void
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400">
      <button onClick={() => onNavigate(-1)} className="flex items-center hover:text-blue-400">
        <Home size={16} />
        <span className="ml-1">Home</span>
      </button>
      {path.map((segment, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={16} />
          <button onClick={() => onNavigate(index)} className="ml-1 hover:text-blue-400">
            {segment}
          </button>
        </div>
      ))}
    </nav>
  )
}

