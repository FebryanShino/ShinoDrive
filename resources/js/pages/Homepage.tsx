import ContentWrapper from "@/components/app/ContentWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MasterLayout from "@/layout/master-layout";
import { useForm } from "@inertiajs/react";
import { IAudioMetadata } from "music-metadata";
import { useState } from "react";

export default function Homepage() {
  const [music, setMusic] = useState<IAudioMetadata>();
  function uint8ArrayToBase64(uint8Array: Uint8Array, format: string) {
    let binary = "";
    uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)));
    return `data:${format};base64,` + btoa(binary);
  }

  const { data, setData, post, progress } = useForm<{ files: any }>({
    files: null,
  });
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(route("upload"), {
      preserveScroll: true,
      preserveState: true,
    });
  }
  return (
    <MasterLayout>
      <ContentWrapper>
        Homepage
        <form onSubmit={handleSubmit}>
          <Input
            multiple
            type="file"
            accept=".mp3,.flac"
            onChange={(e) => setData("files", e.target.files as FileList)}
          />
          <Button type="submit" className="mt-3">
            Submit
          </Button>
        </form>
      </ContentWrapper>
    </MasterLayout>
  );
}
