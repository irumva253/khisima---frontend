import React, { useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import slugify from "slugify";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { RichTextEditorWrapper } from "@/components/rich-text-editor/RichTextEditorWrapper";
import { Uploader } from "@/components/file-uploader/Uploader";

import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from "lucide-react";

import { useGetServiceCategoriesQuery } from "@/slices/serviceCategoriesSlice";
import { useCreateServiceMutation } from "@/slices/serviceApiSlice";

const serviceStatus = ["draft", "published"];

const CreateNewServiceScreen = ({ onBack }) => {
  const [isPending, startTransition] = useTransition();
  const [createService] = useCreateServiceMutation();
  const { data: categoriesData } = useGetServiceCategoriesQuery();
  const serviceCategories = categoriesData?.data || [];

  const methods = useForm({
    defaultValues: {
      title: "",
      slug: "",
      smallDescription: "",
      description: "",
      category: "",
      price: "",
      status: "",
      image: "",
      videoUrl: "",
    }
  });

  const { handleSubmit, setValue, watch } = methods;

  const onSubmit = async (values) => {
    if (!values.title || !values.slug || !values.category) {
      toast.error("Title, slug, and category are required!");
      return;
    }

    startTransition(async () => {
      try {
        await createService({
          ...values,
          price: values.price ? Number(values.price) : 0
        }).unwrap();

        toast.success("Service created successfully!");
        Object.keys(values).forEach((key) => setValue(key, ""));
      } catch (err) {
        toast.error(err?.data?.message || "Failed to create service");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create Service</h1>
      </div>

      <FormProvider {...methods}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide basic information about the service</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={methods.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter service title" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 items-end">
                <FormField
                  control={methods.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Service slug" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const title = watch("title");
                    setValue("slug", slugify(title || ""));
                  }}
                >
                  Generate Slug <SparkleIcon className="ml-1 size-4" />
                </Button>
              </div>

              <FormField
                control={methods.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Small Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter a small description" className="min-h-[120px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditorWrapper field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image (Optional)</FormLabel>
                    <FormControl>
                      <Uploader value={field.value} onChange={field.onChange} fileTypeAccepted="image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceCategories.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (RWF)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter service price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={buttonVariants({ className: "w-full" })}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    Creating...
                    <span className="animate-spin ml-1">
                      <Loader2 className="size-4" />
                    </span>
                  </>
                ) : (
                  <>
                    Create Service <PlusIcon className="ml-1 size-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  );
};

export default CreateNewServiceScreen;