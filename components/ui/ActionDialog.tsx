"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ActionDialog = Dialog;

const CustomDialogTrigger = DialogTrigger;

const CustomDialogPortal = DialogPortal;

const CustomDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogOverlay>,
  React.ComponentPropsWithoutRef<typeof DialogOverlay>
>(({ className, ...props }, ref) => (
  <DialogOverlay ref={ref} className={cn("", className)} {...props} />
));
CustomDialogOverlay.displayName = DialogOverlay.displayName;

const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogContent
      ref={ref}
      className={cn("gap-2 px-0 pb-0", className)}
      {...props}
    >
      {children}
    </DialogContent>
  </DialogPortal>
));
CustomDialogContent.displayName = DialogContent.displayName;

const CustomDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogHeader className={cn("px-7", className)} {...props} />
);
CustomDialogHeader.displayName = DialogHeader.displayName;

const CustomDialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-7", className)} {...props} />
);
CustomDialogBody.displayName = "DialogBody";

const CustomDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <DialogFooter
    className={cn("mt-7 flex items-center gap-0", className)}
    {...props}
  />
);
CustomDialogFooter.displayName = DialogFooter.displayName;

const CustomDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => (
  <DialogTitle ref={ref} className={cn("", className)} {...props} />
));
CustomDialogTitle.displayName = DialogTitle.displayName;

const CustomDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogDescription>,
  React.ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => (
  <DialogDescription ref={ref} className={cn("", className)} {...props} />
));
CustomDialogDescription.displayName = DialogDescription.displayName;

const CustomDialogClose = React.forwardRef<
  React.ElementRef<typeof DialogClose>,
  React.ComponentPropsWithoutRef<typeof DialogClose> & {
    noSeparator?: boolean;
  }
>(({ className, noSeparator, ...props }, ref) => (
  <DialogClose
    ref={ref}
    className={cn(
      "inline-flex h-14 w-full items-center justify-center rounded-none border-r bg-transparent text-center text-base font-medium text-foreground/60 shadow-none outline-none",
      noSeparator && "border-none",
      className,
    )}
    {...props}
  />
));
CustomDialogClose.displayName = DialogClose.displayName;

const CustomDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {}
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-none bg-transparent text-center text-base font-medium text-foreground shadow-none outline-none",
        className,
      )}
      {...props}
    >
      {props.children}
    </button>
  );
});
CustomDialogAction.displayName = "DialogActionButton";

export {
  ActionDialog,
  CustomDialogPortal as DialogPortal,
  CustomDialogOverlay as DialogOverlay,
  CustomDialogTrigger as DialogTrigger,
  CustomDialogClose as DialogClose,
  CustomDialogAction as DialogAction,
  CustomDialogContent as DialogContent,
  CustomDialogHeader as DialogHeader,
  CustomDialogBody as DialogBody,
  CustomDialogFooter as DialogFooter,
  CustomDialogTitle as DialogTitle,
  CustomDialogDescription as DialogDescription,
};
