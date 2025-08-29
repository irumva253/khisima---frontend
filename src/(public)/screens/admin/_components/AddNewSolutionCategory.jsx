import { useState } from "react"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useCreateSolutionCategoryMutation } from "@/slices/solutionCategoriesSlice"

export default function AddNewSolutionCategory() {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    title: "",
    caption: "",
    iconSvg: "",
    description: "",
  })

  const [createCategory, { isLoading }] = useCreateSolutionCategoryMutation()

  const onChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }))

  const validate = () => {
    if (!form.title.trim()) return "Title is required"
    if (form.iconSvg && !form.iconSvg.trim().startsWith("<svg"))
      return "Icon must be a valid SVG"
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const err = validate()
    if (err) {
      toast.error(err)
      return
    }

    try {
      await createCategory({
        title: form.title.trim(),
        caption: form.caption.trim(),
        iconSvg: form.iconSvg.trim(),
        description: form.description.trim(),
      }).unwrap()

      toast.success("Solution category created successfully!")
      setForm({
        title: "",
        caption: "",
        iconSvg: "",
        description: "",
      })
      setOpen(false)
    } catch (error) {
      toast.error(
        error?.data?.errors?.[0]?.message ||
          error?.data?.message ||
          error?.message ||
          "Failed to create category"
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant="outline">
          <PlusCircle className="w-4 h-4" />
          Add Solution Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add New Solution Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 mt-2">
          {/* Title */}
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={onChange("title")}
              placeholder="Enter category title"
              required
            />
          </div>

          {/* Caption */}
          <div className="space-y-1">
            <Label>Caption</Label>
            <Input
              value={form.caption}
              onChange={onChange("caption")}
              placeholder="Optional caption"
            />
          </div>

          {/* Icon SVG */}
          <div className="space-y-1">
            <Label>Icon SVG</Label>
            <Textarea
              value={form.iconSvg}
              onChange={onChange("iconSvg")}
              placeholder="Paste SVG code here"
              rows={6}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900
                         dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-100
                         focus:border-green-500 focus:ring-1 focus:ring-green-500
                         dark:focus:border-green-400 dark:focus:ring-green-400
                         transition-colors duration-200 ease-in-out"
            />
            {/* Live SVG preview */}
            {form.iconSvg.trim().startsWith("<svg") && (
              <div
                className="mt-2 w-12 h-12"
                dangerouslySetInnerHTML={{ __html: form.iconSvg }}
              />
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={onChange("description")}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
