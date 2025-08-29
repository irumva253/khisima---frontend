"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Trash, Edit, Loader2, AlertTriangle } from "lucide-react";

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
  useGetSolutionsQuery,
  useDeleteSolutionMutation,
  useUpdateSolutionMutation,
} from "@/slices/solutionApiSlice";
import { useGetSolutionCategoriesQuery } from "@/slices/solutionCategoriesSlice";

const solutionStatus = ["draft", "published"];

const SolutionsList = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetSolutionsQuery();

  const { data: categoriesData } = useGetSolutionCategoriesQuery();
  const categories = categoriesData?.data || [];
  const solutions = data?.data || [];

  const [deleteSolution] = useDeleteSolutionMutation();
  const [updateSolution, { isLoading: updating }] = useUpdateSolutionMutation();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
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

  const handleEditClick = (solution) => {
    setSelectedSolution(solution);

    // Normalize description for editor
    let descriptionValue = "";
    if (solution.description) {
      if (typeof solution.description === "object") {
        descriptionValue = JSON.stringify(solution.description);
      } else if (typeof solution.description === "string") {
        try {
          JSON.parse(solution.description);
          descriptionValue = solution.description;
        } catch {
          descriptionValue = JSON.stringify({
            type: "doc",
            content: [
              {
                type: "paragraph",
                attrs: { textAlign: "left" },
                content: [{ type: "text", text: solution.description }],
              },
            ],
          });
        }
      }
    }

    setEditForm({
      title: solution.title || "",
      slug: solution.slug || "",
      smallDescription: solution.smallDescription || "",
      description: descriptionValue,
      category: solution.category?._id || "",
      status: solution.status || "",
      fileKey: solution.fileKey || "",
      videoUrl: solution.videoUrl || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSolution({
        id: selectedSolution._id,
        ...editForm,
        description:
          typeof editForm.description === "object"
            ? JSON.stringify(editForm.description)
            : editForm.description,
      }).unwrap();
      toast.success("Service updated successfully");
      setEditDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update service");
    }
  };

  const handleDeleteClick = (solution) => {
    setSelectedSolution(solution);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSolution(selectedSolution._id).unwrap();
      toast.success("Solution deleted successfully");
      setDeleteDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete solution");
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

  //  Loading state
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p>Loading services...</p>
      </div>
    );

  //  Error state
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500">
        <AlertTriangle className="w-10 h-10 mb-3" />
        <p>Failed to load services</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );

  //  Empty state
  if (!solutions.length)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <AlertTriangle className="w-10 h-10 mb-3 text-yellow-500" />
        <p>No solutions found</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Image</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {solutions.map((sol) => (
              <tr
                key={sol._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-2">
                  {sol.fileKey && (
                    <img
                      src={`${S3_BASE_URL}/${sol.fileKey}`}
                      alt={sol.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">{sol.title}</td>
                <td className="px-4 py-2">{sol.category?.title}</td>
                <td className="px-4 py-2 capitalize">{sol.status}</td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(sol)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(sol)}
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
            <DialogTitle className="text-2xl">Edit Solution</DialogTitle>
            <DialogDescription>
              Update the solution details below.
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
                    {solutionStatus.map((s) => (
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
            <DialogTitle>Delete Solution</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedSolution?.title}</strong>?
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

export default SolutionsList;