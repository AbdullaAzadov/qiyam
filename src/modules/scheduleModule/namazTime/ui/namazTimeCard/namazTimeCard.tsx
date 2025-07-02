"use client";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/src/shared/cn/components/ui/card";
import NamazTimeCardItem from "./namazTimeCardItem";
import UserLocationModal from "../../../../../features/userLocationModal/ui/userLocationModal";
import { useNamazTimesCard } from "../../hooks/useNamazTimesCard";
import { NamazTimeCardFooter } from "./namazTimeCardFooter";
import { CalendarDaysIcon, NavigationIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import NamazCalendarDrawer from "../namazCalendar/namazCalendarDrawer";

export default function NamazTimeCard() {
  const date = new Date();
  const h = useNamazTimesCard();

  return (
    <Card className="p-0 overflow-hidden gap-0 relative">
      <CardHeader className="p-0 py-1">
        <div className="flex justify-between items-center px-4 pt-2">
          <NamazCalendarDrawer
            isLoading={h.isMonthTimingsFetching}
            data={h.monthTimingsData?.data}
            trigger={
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="size-4.5 inline text-muted-foreground cursor-pointer" />
                <p className="select-none  text-muted-foreground">
                  {format(date, "d MMMM", { locale: ru })}
                </p>
              </div>
            }
          />
          <UserLocationModal
            trigger={
              <p className="text-muted-foreground text-sm cursor-pointer select-none">
                {h.coordsLabel}{" "}
                <NavigationIcon className="size-3.5 inline fill-muted text-muted" />
              </p>
            }
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
