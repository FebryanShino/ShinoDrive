import React from "react";
import { useMediaQuery } from "react-responsive";

interface ContentWrapperProps extends React.ComponentPropsWithRef<"div"> {
  maxWidth?: string | number;
  contentGap?: string | number;
}

export default function ContentWrapper(props: ContentWrapperProps) {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  return (
    <div className="w-[100%] flex flex-col items-center">
      <div
        className="h-[100%] py-32 flex-col"
        style={{
          width: isDesktopOrLaptop
            ? props.maxWidth
              ? props.maxWidth
              : "1140px"
            : "100%",
          gap: props.contentGap ? props.contentGap : 20,
          paddingInline: !isDesktopOrLaptop ? "20px" : "",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
