type DeleteConfirmationDialogProps = {
  itemName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationDialog({ itemName, onConfirm, onCancel }: DeleteConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-gray-800 rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Delete Confirmation</h2>
        <p className="mb-4">Are you sure you want to delete "{itemName}"?</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700" onClick={onCancel}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

