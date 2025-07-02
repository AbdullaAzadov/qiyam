import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../cn/components/ui/drawer";
import { cn } from "../cn/lib/utils";

type Props = {
  trigger: React.ReactNode;
  triggerClassName?: string;
  header?: {
    title?: string;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    pureNode?: React.ReactNode;
  };
  footer?: {
    className?: string;
    children?: React.ReactNode;
  };
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mobileMode?: boolean;
  shouldScaleBackground?: boolean;
};

export const CustomDrawer = (p: Props) => {
  return (
    <Drawer
      open={p.open}
      onOpenChange={p.onOpenChange}
      shouldScaleBackground={p.shouldScaleBackground}
      closeThreshold={1}
    >
      <DrawerTrigger className={p.triggerClassName} asChild>
        {p.trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader
          className={cn(p.header?.className, !p.header && "hidden")}
        >
          {p.header?.pureNode ? (
            <>
              <DrawerTitle className="hidden" />
              {p.header.pureNode}
            </>
          ) : (
            <>
              <DrawerTitle className={p.header?.titleClassName}>
                {p.header?.title}
              </DrawerTitle>
              <DrawerDescription className={p.header?.descriptionClassName}>
                {p.header?.description}
              </DrawerDescription>
            </>
          )}
        </DrawerHeader>
        {p.children}
        <DrawerFooter
          className={cn(p.footer?.className, !p.footer && "hidden")}
        >
          {p.footer?.children}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
