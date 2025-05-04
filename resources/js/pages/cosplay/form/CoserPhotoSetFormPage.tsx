import BreadcrumbMain from "@/components/app/BreadcrumbMain";
import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MasterLayout from "@/layout/master-layout";
import { CoserInterface } from "@/types/coser";
import { useForm } from "@inertiajs/react";
import { Button } from "antd";
import React, { useState } from "react";

interface ICoserPhotoSetFormPageProps
  extends React.ComponentPropsWithRef<"div"> {
  coser: CoserInterface;
}

export default function CoserPhotoSetFormPage({
  coser,
}: ICoserPhotoSetFormPageProps) {
  const [photoSetNotExists, setPhotoSetNotExists] = useState<boolean>(true);
  const [previews, setPreviews] = useState<any>([]);

  const {
    data: formData,
    setData: setFormData,
    post,
    progress,
  } = useForm<{ name: string; files: any; coser: string; coser_id: string }>({
    coser: coser.name,
    name: "",
    files: null,
    coser_id: coser.id,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post("/cosplay/coser/coser/upload");
  }

  //   console.log(coser.photo_set);

  return (
    <MasterLayout>
      <ContentWrapper>
        <BreadcrumbMain
          paths={[
            { name: "Cosplay", href: "/cosplay" },
            { name: "Coser", href: "/cosplay/coser" },
            { name: coser.name, href: `/cosplay/coser/${coser.id}` },
          ]}
          currentPath="Form"
        />
        <h1>
          {(progress?.loaded as number) / 1048576} MB /{" "}
          {(progress?.total as number) / 1048576} MB
        </h1>
        <h1>{progress?.percentage}%</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Photo Set Name</Label>
            <Input
              required
              id="name"
              type="text"
              onChange={(e) => {
                setPhotoSetNotExists(
                  !coser.photo_set?.find(
                    (item) => e.target.value === item.name,
                  ),
                );
                setFormData("name", e.target.value);
              }}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="files">Files</Label>
            <Input
              id="files"
              type="file"
              onChange={(e) => {
                const files = Array.from(e.target.files as FileList);
                const imagePreviews = files.map((file) => ({
                  file,
                  url: URL.createObjectURL(file),
                }));
                setPreviews(imagePreviews);
                setFormData("files", e.target.files);
              }}
              multiple
            />
          </div>
          <Button htmlType="submit" color="red" disabled={!photoSetNotExists}>
            Upload
          </Button>
        </form>
        <ResponsiveGridWrapper minSize="15rem">
          {previews.map((img: any, index: number) => (
            <img
              key={index}
              src={img.url}
              alt={`Preview ${index}`}
              width="150"
            />
          ))}
        </ResponsiveGridWrapper>
      </ContentWrapper>
    </MasterLayout>
  );
}
