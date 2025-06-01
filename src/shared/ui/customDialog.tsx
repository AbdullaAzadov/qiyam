import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/cn/components/ui/dialog';
import { cn } from '../cn/lib/utils';

type Props = {
  className?: string;
  trigger: React.ReactNode;
  triggerClassName?: string;
  header?: {
    title: string;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    children?: React.ReactNode;
  };
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mobileMode?: boolean;
};

const CustomDialog = (props: Props) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild className={cn(props.triggerClassName)}>
        {props.trigger}
      </DialogTrigger>
      <DialogContent
        className={cn(props.className)}
        mobileMode={props.mobileMode}
      >
        {props.header && (
          <DialogHeader className={cn(props.header.className)}>
            <DialogTitle className={cn(props.header.titleClassName)}>
              {props.header.title}
            </DialogTitle>
            <DialogDescription
              className={cn(props.header.descriptionClassName)}
            >
              {props.header.description}
            </DialogDescription>
            {props.header.children}
          </DialogHeader>
        )}
        <div
          className={cn(
            props.mobileMode && 'w-full flex-1 max-h-[82.5dvh] overflow-y-auto'
          )}
        >
          {props.children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
