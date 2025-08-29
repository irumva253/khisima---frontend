import React, { useState } from "react"
import { toast } from "sonner"
import { Trash, Edit, AlertTriangle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import {
  useGetSolutionCategoriesQuery,
  useDeleteSolutionCategoryMutation,
  useUpdateSolutionCategoryMutation,
} from "@/slices/solutionCategoriesSlice"

const SolutionCategoriesList = () => {
  const { data, isLoading, isError } = useGetSolutionCategoriesQuery()
  const categories = data?.data || []

  const [deleteCategory] = useDeleteSolutionCategoryMutation()
  const [updateCategory, { isLoading: updating }] = useUpdateSolutionCategoryMutation()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editForm, setEditForm] = useState({
    title: "",
    caption: "",
    iconSvg: "",
    description: "",
  })

  // Open edit modal
  const handleEditClick = (category) => {
    setSelectedCategory(category)
    setEditForm({
      title: category.title || "",
      caption: category.caption || "",
      iconSvg: category.iconSvg || "",
      description: category.description || "",
    })
    setEditDialogOpen(true)
  }

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateCategory({ id: selectedCategory._id, ...editForm }).unwrap()
      toast.success("Category updated successfully")
      setEditDialogOpen(false)
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update category")
    }
  }

  // Open delete modal
  const handleDeleteClick = (category) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteCategory(selectedCategory._id).unwrap()
      toast.success("Category deleted successfully")
      setDeleteDialogOpen(false)
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete category")
    }
  }

  const onChange = (key) => (e) =>
    setEditForm((s) => ({ ...s, [key]: e.target.value }))

  // Loading state
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        <p>Loading categories...</p>
      </div>
    )

  // Error state
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p>Failed to load categories</p>
      </div>
    )

  // Empty state
  if (!categories.length)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <AlertTriangle className="w-8 h-8 mb-2 text-yellow-500" />
        <p>No solution categories found</p>
      </div>
    )

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="border rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900 flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-2">
            {cat.iconSvg ? (
              <div
                className="w-10 h-10"
                dangerouslySetInnerHTML={{ __html: cat.iconSvg }}
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {cat.title}
              </h3>
              {cat.caption && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {cat.caption}
                </p>
              )}
            </div>
          </div>
          {cat.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {cat.description}
            </p>
          )}
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleEditClick(cat)}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleDeleteClick(cat)}
            >
              <Trash className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      ))}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-3 mt-2">
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input
                value={editForm.title}
                onChange={onChange("title")}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Caption</Label>
              <Input
                value={editForm.caption}
                onChange={onChange("caption")}
              />
            </div>
            <div className="space-y-1">
              <Label>Icon SVG</Label>
              <Textarea
                value={editForm.iconSvg}
                onChange={onChange("iconSvg")}
                rows={6}
              />
              {editForm.iconSvg?.trim().startsWith("<svg") && (
                <div
                  className="mt-2 w-12 h-12"
                  dangerouslySetInnerHTML={{ __html: editForm.iconSvg }}
                />
              )}
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={onChange("description")}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the category{" "}
            <strong>{selectedCategory?.title}</strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SolutionCategoriesList
