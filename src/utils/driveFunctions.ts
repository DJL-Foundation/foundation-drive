import type { DriveItem } from "../types/drive";

export function getItemPath(items: DriveItem[], itemId: string): string[] {
  const path: string[] = [];
  let currentItem = items.find((item) => item.id === itemId);

  while (currentItem) {
    path.unshift(currentItem.name);
    currentItem = currentItem.parent
      ? items.find((item) => item.id === currentItem!.parent)
      : null;
  }

  return path;
}
