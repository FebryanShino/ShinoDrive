import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface IBreadcrumbMainProps extends React.ComponentPropsWithoutRef<"div"> {
  paths: {
    name: string;
    href: string;
  }[];
  currentPath: string;
}

export default function BreadcrumbMain(props: IBreadcrumbMainProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {props.paths.map((path, index) => (
          <>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={path.href}>{path.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{props.currentPath}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
