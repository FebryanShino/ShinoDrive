import { cn } from "@/lib/utils";
import { Tag } from "@/types";
import { PhotoSetItemInterface } from "@/types/coser";
import { cleanUrl } from "@/utils";
import { Link, useForm } from "@inertiajs/react";
import { Flex } from "antd";
import {
  ChevronsUpDown,
  ExternalLink,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

interface ITagButtonProps extends React.ComponentPropsWithoutRef<"div"> {
  tag: Tag;
  tags: Tag[];
  photo_set_item: PhotoSetItemInterface;
}

function TagButton(props: ITagButtonProps) {
  const {
    data,
    setData,
    progress,
    delete: deleteTag,
  } = useForm({
    tag_id: props.tag.id,
    photo_set_item_id: props.photo_set_item.id,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    deleteTag(
      route("coser.photo_set_item.remove_tag", {
        photo_set_item_id: data.photo_set_item_id,
        tag_id: data.tag_id,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        onFinish: () =>
          toast(
            `Tag "${props.tags.find((tag) => tag.id === data.tag_id)?.name}" has been deleted`,
            {
              description: (
                <p className="text-gray-400">{props.photo_set_item.name}</p>
              ),
              icon: (
                <img
                  src={cleanUrl(props.photo_set_item.path)}
                  alt=""
                  width={150}
                />
              ),
            },
          ),
      },
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {props.tag.name}
          <XIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{props.tag.name}</DialogTitle>
          <DialogDescription>Choose your action</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between w-full items-center">
          <form onSubmit={handleSubmit} className="mr-auto">
            <Button variant="outline" className="border-red-700 text-red-700">
              <TrashIcon />
              Remove Tag
            </Button>
          </form>
          <Link href={route("cosplay.browse") + `?search=${props.tag.name}`}>
            <Button variant="outline">
              Browse "{props.tag.name}" <ExternalLink />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PhotoSetItemDetailCardProps
  extends React.ComponentPropsWithRef<"div"> {
  photo_set_item: PhotoSetItemInterface;
  tags: Tag[];
  children?: React.ReactNode;
}

export default function PhotoSetItemDetailCard(
  props: PhotoSetItemDetailCardProps,
) {
  const [open, setOpen] = React.useState(false);
  const { data, setData, progress, post } = useForm({
    tag_id: "",
    photo_set_item_id: props.photo_set_item.id,
  });
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(route("coser.photo_set_item.add_tag"), {
      preserveScroll: true,
      preserveState: true,
      onFinish: () =>
        toast(
          `Tag "${props.tags.find((tag) => tag.id === data.tag_id)?.name}" has been added`,
          {
            description: (
              <p className="text-gray-400">{props.photo_set_item.name}</p>
            ),
            icon: (
              <img
                src={cleanUrl(props.photo_set_item.path)}
                alt=""
                width={150}
              />
            ),
            //   action: {
            //     label: "Undo",
            //     onClick: () => console.log("Undo"),
            //   },
          },
        ),
    });
  }
  return (
    <>
      <h4 className="font-medium mb-3">{props.photo_set_item.name}</h4>
      <h4 className="font-medium mb-3 mt-6">Details</h4>
      <Flex vertical>
        <p>Size : {(props.photo_set_item.size / 1048576).toFixed(2)} MB</p>
        <p>
          Resolution : {props.photo_set_item.width}x
          {props.photo_set_item.height}
        </p>
        <p>Extension : {props.photo_set_item.extension}</p>
      </Flex>
      <h4 className="font-medium mb-3 mt-6">Tags</h4>

      <Flex wrap gap={2}>
        {props.photo_set_item.tags?.map((tag) => (
          <>
            <TagButton
              tag={tag}
              tags={props.tags}
              photo_set_item={props.photo_set_item}
            />
            <Separator orientation="vertical" />
          </>
        ))}
      </Flex>

      <Popover onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" className="mt-3">
            <PlusIcon />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <h4 className="font-medium mb-3">Tags</h4>
          <form className="flex gap-1" onSubmit={handleSubmit}>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[200px] justify-between"
                >
                  {data.tag_id
                    ? props.tags.find((tag) => tag.id === data.tag_id)?.name
                    : "Select tags..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search tags..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup>
                      {props.tags.map((tag) => (
                        <CommandItem
                          key={tag.name}
                          value={tag.name}
                          disabled={
                            !!props.photo_set_item.tags?.find(
                              (itemTag) => itemTag.id === tag.id,
                            )
                          }
                          onSelect={(currentValue) => {
                            const currentTag = props.tags.find(
                              (tag) => tag.name === currentValue,
                            ) as Tag;
                            setData("tag_id", currentTag.id);
                            setOpen(false);
                          }}
                        >
                          {tag.name}
                          <Checkbox
                            className={cn(
                              "ml-auto",
                              data.tag_id === tag.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* <Select
              defaultValue={data.tag_id}
              name="tag"
              onValueChange={(value) => setData("tag_id", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {props.tags.map((tag) => (
                    <SelectItem value={tag.id}>{tag.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
            <Button size="icon" type="submit">
              <PlusIcon />
            </Button>
          </form>
        </PopoverContent>
      </Popover>
      <Separator className="mt-3" />
      {props.children}
    </>
  );
}
