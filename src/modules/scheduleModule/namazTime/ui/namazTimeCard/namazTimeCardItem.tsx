import { cn } from "@/src/shared/cn/lib/utils";
import { TIMEZONE } from "@/src/shared/lib/consts";
import { parseISO } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { Volume1Icon } from "lucide-react";
import React from "react";

type Props = {
  label: string;
  time?: string;
  subTime?: string;
  subTimeLabel?: string;
  iconClassName?: string;
  className?: string;
  isLoading?: boolean;
};

const NamazTimeCardItem = ({
  label,
  time,
  subTime,
  subTimeLabel,
  iconClassName,
  className,
  isLoading,
}: Props) => {
  const iconCn =
    "absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 size-4.5 stroke-1 fill-muted text-muted";
  const itemCn = "flex items-center justify-between relative font-semibold";
  const transitionCn = "transition-all duration-300";
  const isLoadingNoPaddingCn =
    "bg-muted-foreground text-transparent rounded-lg opacity-25";
  const isLoadingCn =
    "bg-muted-foreground text-transparent px-4 rounded-lg opacity-25";

  const formattedTime = time && formatTime(time);

  return (
    <div
      className={cn(
        itemCn,
        transitionCn,
        isLoading && "animate-pulse",
        className
      )}
    >
      <p>
        <span className={cn(transitionCn, isLoading && isLoadingCn)}>
          {label}
        </span>
        {subTimeLabel && (
          <>
            <br />
            <span
              className={cn(
                transitionCn,
                "font-light text-sm text-muted-foreground",
                isLoading && isLoadingNoPaddingCn
              )}
            >
              {subTimeLabel}
            </span>
          </>
        )}
      </p>
      <Volume1Icon
        className={cn(iconCn, iconClassName, isLoading && "opacity-0")}
      />
      <p className={cn("font-digits")}>
        <span
          className={cn(isLoading && isLoadingNoPaddingCn, isLoading && "px-2")}
        >
          {formattedTime ? formattedTime : "--:--"}
        </span>
        {subTime && (
          <>
            <br />
            <span
              className={cn(
                "font-light text-sm text-muted-foreground",
                isLoading && isLoadingNoPaddingCn
              )}
            >
              {formatTime(subTime)}
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default NamazTimeCardItem;

export const formatTime = (isoString: string): string => {
  const date = toZonedTime(parseISO(isoString), TIMEZONE);
  return format(date, "HH:mm", { timeZone: TIMEZONE });
};
