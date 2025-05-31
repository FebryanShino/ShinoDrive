import BreadcrumbMain from "@/components/app/BreadcrumbMain";
import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import MasterLayout from "@/layout/master-layout";
import { PhotoSetInterface } from "@/types/coser";
import { useForm } from "@inertiajs/react";
import { Flex } from "antd";
import React, { useState } from "react";
import { toast } from "sonner";

interface ICoserPhotoSetItemFormPageProps
  extends React.ComponentPropsWithRef<"div"> {
  photo_set: PhotoSetInterface;
}

export default function CoserPhotoSetItemFormPage({
  photo_set,
}: ICoserPhotoSetItemFormPageProps) {
  const [photoSetNotExists, setPhotoSetNotExists] = useState<boolean>(true);
  const [previews, setPreviews] = useState<{
    duplicates: any[];
    new_items: any[];
  }>({
    new_items: [],
    duplicates: [],
  });

  const {
    data: formData,
    setData: setFormData,
    post,
    progress,
    processing,
  } = useForm<{ name: string; files: any; coser: string; coser_id: string }>({
    coser: photo_set.coser.name,
    name: photo_set.name,
    files: null,
    coser_id: photo_set.coser.id,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(photoSetNotExists);
    post("/cosplay/coser/coser/photo_set/upload", {
      onFinish: () =>
        toast(`${previews.new_items.length} Images has been Added`, {
          description: photo_set.name,
        }),
    });
  }
  return (
    <MasterLayout>
      <ContentWrapper>
        <BreadcrumbMain
          paths={[
            { name: "Cosplay", href: "/cosplay" },
            { name: "Coser", href: "/cosplay/coser" },
            {
              name: photo_set.coser.name,
              href: `/cosplay/coser/${photo_set.coser.id}`,
            },
            {
              name: photo_set.name,
              href: `/cosplay/coser/${photo_set.coser.id}/${photo_set.id}`,
            },
          ]}
          currentPath="Upload"
        />

        <h1 className="text-2xl">{photo_set.name}</h1>
        <form onSubmit={handleSubmit}>
          <h1 className="font-bold text-lg">Upload Form</h1>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="files">Files</Label>
            <Input
              required
              id="files"
              type="file"
              onChange={(e) => {
                const nonDuplicates: File[] = [];
                const imagePreviewsDupes: any[] = [];
                const imagePreviewsNew: any[] = [];
                const files = Array.from(e.target.files as FileList);

                files.forEach((file) => {
                  if (
                    photo_set.photo_set_item.find(
                      (item) => item.name === file.name,
                    )
                  ) {
                    imagePreviewsDupes.push({
                      file,
                      url: URL.createObjectURL(file),
                      isExists: true,
                    });
                  } else {
                    imagePreviewsNew.push({
                      file,
                      url: URL.createObjectURL(file),
                      isExists: false,
                    });
                    nonDuplicates.push(file);
                  }
                });
                setPreviews({
                  duplicates: imagePreviewsDupes,
                  new_items: imagePreviewsNew,
                });
                setFormData("files", nonDuplicates);
              }}
              multiple
            />
          </div>
          <Button
            type="submit"
            color="red"
            size="lg"
            className="mt-4"
            style={{
              transition: "background .3s",
              background: `linear-gradient(90deg, crimson ${progress?.percentage ?? 0}%, black 0%)`,
            }}
          >
            Upload
          </Button>
        </form>
        <h1>
          {((progress?.loaded ?? 0) / 1048576).toFixed(2)} MB /{" "}
          {((progress?.total ?? 0) / 1048576).toFixed(2)} MB
        </h1>
        <Flex align="center" gap={10}>
          <Progress value={progress?.percentage ?? 0} />
          <h1>{progress?.percentage ?? 0}%</h1>
        </Flex>
        <div>
          <Separator />
          <h1 className="text-lg font-bold mt-5">Image Previews</h1>
          {previews.new_items.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h1>New files ({previews.new_items.length} Item(s))</h1>
                </AccordionTrigger>
                <AccordionContent>
                  <ResponsiveGridWrapper minSize="13rem">
                    {previews.new_items.map((img: any, index: number) => (
                      <div
                        key={index}
                        className={
                          "relative w-full h-auto overflow-hidden aspect-square bg-cover bg-top"
                        }
                        style={{
                          backgroundImage: `url("${img.url}")`,
                        }}
                      ></div>
                    ))}
                  </ResponsiveGridWrapper>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {previews.duplicates.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h1>Duplicates ({previews.duplicates.length} Item(s))</h1>
                </AccordionTrigger>
                <AccordionContent>
                  <ResponsiveGridWrapper minSize="10rem">
                    {previews.duplicates.map((img: any, index: number) => (
                      <div
                        key={index}
                        className={
                          "relative w-full h-auto overflow-hidden aspect-square bg-cover bg-top"
                        }
                        style={{
                          backgroundImage: `url("${img.url}")`,
                        }}
                      >
                        <div
                          className="w-full h-full absolute z-10 bg-amber-400 flex justify-center items-center"
                          style={{ opacity: 0.5 }}
                        >
                          <h2>Duplicate</h2>
                        </div>
                      </div>
                    ))}
                  </ResponsiveGridWrapper>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </ContentWrapper>
    </MasterLayout>
  );
}
