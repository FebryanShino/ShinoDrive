import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { AudioLinesIcon, SearchIcon } from "lucide-react";

const NAV_BUTTONS = [
  {
    name: "Tracks",
    route: "music.track.index",
  },
  {
    name: "Album",
    route: "music.album.index",
  },
  {
    name: "Artist",
    route: "music.artist.index",
  },
];

export default function MusicLayout(props: React.ComponentPropsWithRef<"div">) {
  const isMobile = useIsMobile();
  return (
    <div className="bg-primary min-h-dvh">
      <div
        className={cn(
          "w-full flex h-14 bg-gray-900 justify-between sticky top-0 z-100",
          isMobile ? "pr-0" : "pr-10",
        )}
      >
        <NavigationMenu viewport={true} className="h-full">
          <NavigationMenuList className="flex-wrap h-14 m-0 w-full gap-0">
            <NavigationMenuItem className="h-full aspect-square ">
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-gray rounded-none h-full w-full text-white hover:text-black ",
                )}
              >
                <Link
                  onClick={(e) =>
                    route().current("music.index") && e.preventDefault()
                  }
                  href={route("music.index")}
                  className={cn(
                    route().current("music.index")
                      ? "bg-red-900 hover:bg-red-900 focus:bg-red-900"
                      : "bg-gray-200 hover:bg-red-900",
                  )}
                >
                  <AudioLinesIcon
                    className={cn(
                      route().current("music.index")
                        ? "text-white"
                        : "text-black hover:text-white",
                    )}
                    size={300}
                  />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {NAV_BUTTONS.map((item, index) => (
              <NavigationMenuItem className="h-full w-20" key={index}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-gray rounded-none h-full w-full text-white hover:text-black",
                  )}
                >
                  <Link href={route(item.route)}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="h-full aspect-square ml-auto">
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-gray rounded-none h-full w-full text-white hover:text-black ",
                )}
              >
                <Link href={route("music.browse")}>
                  <SearchIcon
                    className="text-white hover:text-black"
                    size={200}
                  />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {props.children}
    </div>
  );
}
