import { QRCode } from "antd";
import "boxicons";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

export default function Navigation() {
  return (
    <div
      className="w-full flex h-[3.5rem] border-b-[.1rem] border-black justify-between sticky top-0 z-[999] mb-4"
      style={{
        paddingInline: "4rem",
        backdropFilter: "blur(5px)",
        background: "hsla(0,0%,100%, .5)",
      }}
    >
      {/* <NavigationMenu style={{ listStyleType: "none" }}></NavigationMenu> */}
      <img
        src="/logo.png"
        alt=""
        height="100%"
        style={{ filter: "invert(1)" }}
      />
      <Drawer direction="right">
        <DrawerTrigger>
          Triggerrrrr <i className="bx bx-user"></i>
        </DrawerTrigger>
        <DrawerContent className="z-[999]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos
          perferendis molestiae ut tenetur voluptate fugit molestias quia,
          quisquam quasi optio magni alias non assumenda dicta dolores nemo
          neque porro, id enim similique pariatur natus eos obcaecati.
          Temporibus ipsa, voluptatum neque commodi sed ratione libero itaque,
          nulla consequatur vitae esse maxime alias nesciunt laboriosam dolores
          fugiat eius obcaecati ducimus? Laborum, quam aliquam quos quasi optio
          alias dicta quas architecto ut, ipsum, voluptatibus illum odio.
          Ducimus sapiente quasi odit aut iusto nihil eligendi beatae officiis
          labore, reiciendis quia pariatur consequuntur provident ea a,
          perspiciatis, adipisci facere exercitationem rem? Atque consequatur
          officia soluta!
          <QRCode value={route("cosplay")} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
