"use client";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/src/shared/cn/components/ui/card";
import NamazTimeCardItem from "./namazTimeCardItem";
import UserGeolocation from "../../userGeolocation/ui/userGeolocation";
import { useNamazTimesCard } from "../hooks/useNamazTimesCard";
import { NamazTimeCardFooter } from "./namazTimeCardFooter";

export default function NamazTimeCard() {
  const h = useNamazTimesCard();

  return (
    <Card className="p-0 overflow-hidden gap-0 relative">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center px-4 pt-2">
          <p className="text-foreground text-lg select-none">Время намаза</p>
          <UserGeolocation
            triggerLabel={h.coordsLabel}
            onFetchGPS={h.handleChangeCoords}
            onSelectLocation={h.handleLocationSelect}
          />
        </div>
      </CardHeader>
      <hr />
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-3 px-4">
          {h.namazTimes.map((namaz, i) => (
            <NamazTimeCardItem
              key={i}
              {...namaz}
              isLoading={h.isTimingsFetching}
            />
          ))}
        </div>
        <NamazTimeCardFooter
          isLoading={h.isTimingsFetching}
          namazTimings={h.timings}
        />
      </CardContent>
    </Card>
  );
}
