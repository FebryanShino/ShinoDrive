import Footer from "@/components/app/Footer";
import Navigation from "@/components/app/Navigation";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

export default function MasterLayout(
  props: React.ComponentPropsWithRef<"div">,
) {
  return (
    <>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      ></link>
      <Navigation />
      {props.children}
      <Footer />
      <Toaster />
    </>
  );
}
