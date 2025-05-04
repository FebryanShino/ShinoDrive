import { Flex } from 'antd';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

interface ContentWrapperProps extends React.ComponentPropsWithRef<'div'> {
  maxWidth?: string | number;
  contentGap?: string | number;
}

export default function ContentWrapper(props: ContentWrapperProps) {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  return (
    <Flex className="w-[100%]" align="center" vertical {...props}>
      <Flex
        className="h-[100%] py-32"
        vertical
        gap={props.contentGap ? props.contentGap : 20}
        style={{
          width: isDesktopOrLaptop
            ? props.maxWidth
              ? props.maxWidth
              : '1140px'
            : '100%',
          paddingInline: !isDesktopOrLaptop ? '20px' : '',
        }}
      >
        {props.children}
      </Flex>
    </Flex>
  );
}
