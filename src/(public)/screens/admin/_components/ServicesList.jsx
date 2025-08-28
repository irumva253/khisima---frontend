"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Trash, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RichTextEditorWrapper } from "@/components/rich-text-editor/RichTextEditorWrapper";
import Uploader from "@/components/file-uploader/Uploader";
import { S3_BASE_URL } from "@/constants";

import {
  useGetServicesQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from "@/slices/serviceApiSlice";
import { useGetServiceCategoriesQuery } from "@/slices/serviceCategoriesSlice";

const serviceStatus = ["draft", "published"];

const ServicesList = () => {
  const { data, isLoading, isError } = useGetServicesQuery();
  const { data: categoriesData } = useGetServiceCategoriesQuery();
  const categories = categoriesData?.data || [];
  const services = data?.data || [];

  const [deleteService] = useDeleteServiceMutation();
  const [updateService, { isLoading: updating }] = useUpdateServiceMutation();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    smallDescription: "",
    description: "",
    category: "",
    status: "",
    fileKey: "",
    videoUrl: "",
  });

  const handleEditClick = (service) => {
    setSelectedService(service);

    // Prepare description for the editor
    let descriptionValue = "";
    if (service.description) {
      if (typeof service.description === 'object') {
        // If it's already an object, stringify it for the editor
        descriptionValue = JSON.stringify(service.description);
      } else if (typeof service.description === 'string') {
        // If it's a string, check if it's JSON
        try {
          JSON.parse(service.description);
          descriptionValue = service.description;
        } catch (e) {
          console.error("Failed to parse service description:", e);
          // If it's not JSON, create a simple structure
          descriptionValue = JSON.stringify({
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                attrs: { textAlign: 'left' },
                content: [
                  {
                    type: 'text',
                    text: service.description
                  }
                ]
              }
            ]
          });
        }
      }
    }
    
    setEditForm({
      title: service.title || "",
      slug: service.slug || "",
      smallDescription: service.smallDescription || "",
      description: descriptionValue,
      category: service.category?._id || "",
      status: service.status || "",
      fileKey: service.fileKey || "",
      videoUrl: service.videoUrl || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateService({ 
        id: selectedService._id,
        ...editForm,
        description: typeof editForm.description === "object"
          ? JSON.stringify(editForm.description)
          : editForm.description,
      }).unwrap();
      toast.success("Service updated successfully");
      setEditDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update service");
    }
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteService(selectedService._id).unwrap();
      toast.success("Service deleted successfully");
      setDeleteDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete service");
    }
  };

  const onChange = (key) => (e) =>
    setEditForm((s) => ({ ...s, [key]: e.target.value }));

  const getVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (isLoading) return <p>Loading services...</p>;
  if (isError) return <p>Failed to load services</p>;

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Image
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {services.map((srv) => (
              <tr key={srv._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-4 py-2">
                  {srv.fileKey && (
                    <img
                      src={`${S3_BASE_URL}/${srv.fileKey}`}
                      alt={srv.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">{srv.title}</td>
                <td className="px-4 py-2">{srv.category?.title}</td>
                <td className="px-4 py-2 capitalize">{srv.status}</td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(srv)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(srv)}
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog - WIDER VERSION */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="w-full max-w-[95vw] lg:max-w-7xl max-h-[95vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Service</DialogTitle>
            <DialogDescription>
              Update the service details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="grid gap-4 mt-2">
            {/* Title + Slug */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base">Title *</Label>
                <Input 
                  value={editForm.title} 
                  onChange={onChange("title")} 
                  required 
                  className="h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Slug *</Label>
                <Input 
                  value={editForm.slug} 
                  onChange={onChange("slug")} 
                  required 
                  className="h-12 text-lg"
                />
              </div>
            </div>

            {/* Small Description */}
            <div className="space-y-2">
              <Label className="text-base">Small Description</Label>
              <Textarea
                value={editForm.smallDescription}
                onChange={onChange("smallDescription")}
                rows={3}
                className="text-lg min-h-[100px]"
              />
            </div>

            {/* Rich Text Description */}
            <div className="space-y-2">
              <Label className="text-base">Description</Label>
              <div className="border rounded-md p-1">
                <RichTextEditorWrapper
                  value={editForm.description}
                  onChange={(value) => setEditForm({ ...editForm, description: value })}
                />
              </div>
            </div>

            {/* Image Uploader */}
            <div className="space-y-2">
              <Label className="text-base">Thumbnail Image</Label>
              <Uploader
                value={editForm.fileKey}
                onChange={(key) => setEditForm({ ...editForm, fileKey: key })}
              />
            </div>

            {/* YouTube */}
            <div className="space-y-2">
              <Label className="text-base">YouTube Video URL</Label>
              <Input 
                value={editForm.videoUrl} 
                onChange={onChange("videoUrl")} 
                className="h-12 text-lg"
              />
              {editForm.videoUrl && getVideoId(editForm.videoUrl) && (
                <div className="mt-2 aspect-video max-w-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getVideoId(editForm.videoUrl)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg border-2"
                  />
                </div>
              )}
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-base">Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(v) => setEditForm({ ...editForm, category: v })}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id} className="text-lg">
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceStatus.map((s) => (
                      <SelectItem key={s} value={s} className="text-lg">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)} 
                type="button"
                className="h-12 px-6 text-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updating}
                className="h-12 px-8 text-lg"
              >
                {updating ? "Updating..." : "Update Service"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedService?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
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
  );
};

export default ServicesList;