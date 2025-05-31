import ContentWrapper from "@/components/app/ContentWrapper";
import ResponsiveGridWrapper from "@/components/app/ResponsiveGridWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MasterLayout from "@/layout/master-layout";
import { PageProps } from "@inertiajs/core";
import { useForm, usePage } from "@inertiajs/react";
import { IAudioMetadata } from "music-metadata";
import { useState } from "react";

interface TrackInformation {
  track_title: string;
  album_title: string;
  artist_name: string;
  track_tracknumber: string;
  track_discnumber: string;
  image_filename: string;
  image_mime: string;
  image_data: string;
}

interface InertiaPageProps extends PageProps {
  flash?: {
    trackInfo: TrackInformation[];
  };
}

export default function Homepage() {
  const [music, setMusic] = useState<IAudioMetadata>();
  function uint8ArrayToBase64(uint8Array: Uint8Array, format: string) {
    let binary = "";
    uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)));
    return `data:${format};base64,` + btoa(binary);
  }
  const { props } = usePage<InertiaPageProps>();
  const trackInfo = props.flash?.trackInfo;
  console.log(trackInfo);

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
        <ResponsiveGridWrapper minSize="15rem">
          {trackInfo?.map((track) => (
            <div
              className="w-full h-auto aspect-square bg-cover bg-center relative text-white"
              style={{
                backgroundImage: `url("${`data:${track?.image_mime};base64,${track?.image_data}"`})`,
              }}
            >
              <div
                className="w-full h-full bg-[rgba(0,0,0,.5)] flex justify-center items-center flex-col text-center p-3"
                style={{ backdropFilter: "blur(2px)" }}
              >
                <h1 className="z-1 font-bold text-lg">{track.track_title}</h1>
                <p className="text-sm">
                  {track.album_title ?? "Unknown Album"}
                </p>
                <p className="text-sm mt-3">{track.artist_name}</p>
              </div>
            </div>
          ))}
        </ResponsiveGridWrapper>
      </ContentWrapper>
    </MasterLayout>
  );
}
