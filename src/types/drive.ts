export type File = {
  id: string
  name: string
  mimeType: string
  size: number
  modifiedAt: string
  parent: string | null
  visibility: "private" | "public"
}

export type Folder = {
  id: string
  name: string
  modifiedAt: string
  parent: string | null
  visibility: "private" | "public"
}

export type DriveItem = File | Folder

export type DriveState = {
  items: DriveItem[]
  currentPath: string[]
  layout: "grid" | "list"
  currentPage: number
  itemsPerPage: number
}

