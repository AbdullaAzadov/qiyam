import { cn } from "@/src/shared/cn/lib/utils";
import React from "react";
import { INamazTimings } from "../api/types";
import { getNearestNamazTime } from "../lib/utils";
import { useCurrentTime } from "@/src/shared/hooks/useCurrentTime";

type Props = {
  isLoading: boolean;
  namazTimings?: INamazTimings;
};

export const NamazTimeCardFooter = ({ isLoading, namazTimings }: Props) => {
  const time = useCurrentTime();
  const { nearestNamazLabel, remainingTimeToNearestNamaz } =
    getNearestNamazTime(namazTimings, time);
  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground py-2 font-semibold transition-all px-4 flex justify-between items-center",
        isLoading && "animate-pulse text-transparent"
      )}
    >
      <p>{nearestNamazLabel} через</p>
      <p className="font-digits">{remainingTimeToNearestNamaz}</p>
    </div>
  );
};
