import React, { useState } from "react";
import { toast } from "sonner";
import { Trash, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
    price: "",
    status: "",
    image: "",
    videoUrl: "",
  });

  const handleEditClick = (service) => {
    setSelectedService(service);
    setEditForm({
      title: service.title || "",
      slug: service.slug || "",
      smallDescription: service.smallDescription || "",
      description: service.description || "",
      category: service.category?._id || "",
      price: service.price || "",
      status: service.status || "",
      image: service.image || "",
      videoUrl: service.videoUrl || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateService({ id: selectedService._id, ...editForm }).unwrap();
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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (isLoading) return <p>Loading services...</p>;
  if (isError) return <p>Failed to load services</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {services.map((srv) => (
        <div
          key={srv._id}
          className="border rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900 flex flex-col justify-between"
        >
          {srv.image && (
            <img
              src={srv.image}
              alt={srv.title}
              className="w-full h-40 object-cover rounded mb-3"
            />
          )}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {srv.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {srv.smallDescription}
          </p>
          {srv.price && (
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Price: {srv.price} RWF
            </p>
          )}
          {srv.videoUrl && (
            <a
              href={srv.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm mt-2"
            >
              Watch Video
            </a>
          )}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleEditClick(srv)}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => handleDeleteClick(srv)}
            >
              <Trash className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      ))}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={editForm.title} onChange={onChange("title")} required />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={editForm.slug} onChange={onChange("slug")} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Small Description</Label>
              <Textarea
                value={editForm.smallDescription}
                onChange={onChange("smallDescription")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditorWrapper
                value={editForm.description}
                onChange={(value) => setEditForm({ ...editForm, description: value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={editForm.image} onChange={onChange("image")} />
                {editForm.image && (
                  <div className="mt-2">
                    <img
                      src={editForm.image}
                      alt="Preview"
                      className="max-h-40 object-contain rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>YouTube Video URL</Label>
                <Input value={editForm.videoUrl} onChange={onChange("videoUrl")} />
                {editForm.videoUrl && getVideoId(editForm.videoUrl) && (
                  <div className="mt-2 aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getVideoId(editForm.videoUrl)}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded border"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(v) => setEditForm({ ...editForm, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price (RWF)</Label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={onChange("price")}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceStatus.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update Service"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the service{" "}
            <strong>{selectedService?.title}</strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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