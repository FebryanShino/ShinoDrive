import BreadcrumbMain from "@/components/app/BreadcrumbMain";
import ContentWrapper from "@/components/app/ContentWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MasterLayout from "@/layout/master-layout";
import { CoserInterface } from "@/types/coser";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";

interface ICoserFormPageProps extends React.ComponentPropsWithRef<"div"> {
  cosers: CoserInterface[];
}

export default function CoserFormPage(props: ICoserFormPageProps) {
  const [coserNotExists, setCoserNotExists] = useState<boolean>(true);

  const {
    data: formData,
    setData: setFormData,
    post,
    progress,
  } = useForm<{ name: string; description: string; translation: string }>({
    name: "",
    translation: "",
    description: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(coserNotExists);
    post("/cosplay/coser/upload");
  }
  return (
    <MasterLayout>
      <ContentWrapper>
        <BreadcrumbMain
          paths={[
            { name: "Cosplay", href: "/cosplay" },
            { name: "Coser", href: "/cosplay/coser" },
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
            <Label htmlFor="name">Coser Name</Label>
            <Input
              required
              id="name"
              type="text"
              onChange={(e) => {
                setCoserNotExists(
                  !props.cosers?.find((item) => e.target.value === item.name),
                );
                setFormData("name", e.target.value);
              }}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Translation</Label>
            <Input
              id="description"
              type="text"
              onChange={(e) => {
                setFormData("translation", e.target.value);
              }}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Description</Label>
            <Textarea
              onChange={(e) => {
                setFormData("description", e.target.value);
              }}
            />
          </div>

          <Button type="submit" color="red" disabled={!coserNotExists}>
            Upload
          </Button>
        </form>
      </ContentWrapper>
    </MasterLayout>
  );
}
