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
import Uploader from "@/components/file-uploader/Uploader"
import { useCreatePartnerMutation } from "@/slices/partnerApiSlice"

const AddNewPartner = ({ refetchPartners }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [fileKey, setFileKey] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const [createPartner, { isLoading }] = useCreatePartnerMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (!fileKey) {
      toast.error("Please upload an image")
      return
    }

    try {
      const partnerData = {
        title: title.trim(),
        fileKey
      }

      const res = await createPartner(partnerData).unwrap()
      console.log("Partner created:", res)

      toast.success("Partner created successfully!")
      setTitle("")
      setFileKey("")
      setOpen(false)
      
      if (refetchPartners) {
        refetchPartners()
      }
    } catch (error) {
      console.error("Error creating partner:", error)
      toast.error(error?.data?.message || "Failed to create partner")
    }
  }

  // This is the key change - handle file key changes directly
  const handleFileKeyChange = (newFileKey) => {
    console.log('File key changed:', newFileKey)
    setFileKey(newFileKey)
  }

  const handleUploadStart = () => {
    setIsUploading(true)
  }

  const handleUploadError = (error) => {
    setIsUploading(false)
    toast.error("Failed to upload image")
    console.error("Upload error:", error)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Partner
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Partner Title *</Label>
            <Input
              id="title"
              placeholder="Enter partner name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Partner Logo *</Label>
            <Uploader
              value={fileKey} // Pass current file key
              onChange={handleFileKeyChange} // Handle file key changes
              onUploadStart={handleUploadStart}
              onUploadError={handleUploadError}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
            />
            {fileKey && (
              <p className="text-sm text-green-600">Image uploaded successfully!</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading || !fileKey}
            >
              {isLoading ? "Creating..." : "Add Partner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewPartner