import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/shared/cn/components/ui/alert-dialog';
import { cn } from '../cn/lib/utils';

type Props = {
  trigger: React.ReactNode;
  className?: string;
  header?: {
    title: string;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
  };
  footer?: {
    cancel?: string;
    action?: string;
    className?: string;
    cancelClassName?: string;
    actionClassName?: string;
    onCancel?: () => void;
    onAction?: () => void;
  };
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CustomAlert = (props: Props) => {
  return (
    <AlertDialog open={props.open}>
      <AlertDialogTrigger asChild>{props.trigger}</AlertDialogTrigger>
      <AlertDialogContent className={cn(props.className)}>
        {props.header && (
          <AlertDialogHeader className={cn(props.header.className)}>
            <AlertDialogTitle className={cn(props.header.titleClassName)}>
              {props.header.title}
            </AlertDialogTitle>
            <AlertDialogDescription
              className={cn(props.header.descriptionClassName)}
            >
              {props.header.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        )}
        {props.children}
        {props.footer && (
          <AlertDialogFooter className={cn(props.footer.className)}>
            {props.footer.cancel && (
              <AlertDialogCancel
                onClick={props.footer.onCancel}
                className={cn(props.footer.cancelClassName)}
              >
                {props.footer.cancel}
              </AlertDialogCancel>
            )}
            {props.footer.action && (
              <AlertDialogAction
                onClick={props.footer.onAction}
                className={cn(props.footer.actionClassName)}
              >
                {props.footer.action}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
