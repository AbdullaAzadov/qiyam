import { Button } from "@/src/shared/cn/components/ui/button";
import { DrawerClose } from "@/src/shared/cn/components/ui/drawer";
import { CustomDrawer } from "@/src/shared/ui/customDrawer";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { INamazDataWithDate } from "../../api/types";
import { formatTime } from "../namazTimeCard/namazTimeCardItem";
import { cn } from "@/src/shared/cn/lib/utils";

type Props = {
  trigger: React.ReactNode;
  isLoading?: boolean;
  data?: INamazDataWithDate[];
};

const date = new Date();

const NamazCalendarDrawer = ({ trigger, isLoading, data }: Props) => {
  return (
    <CustomDrawer
      trigger={trigger}
      header={{
        pureNode: (
          <p className="text-center text-lg font-semibold">
            Календарь намазов за {format(date, "LLL", { locale: ru })}
          </p>
        ),
      }}
      footer={{
        className: "p-4 flex justify-end",
        children: (
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {}}
            >
              Закрыть
            </Button>
          </DrawerClose>
        ),
      }}
      shouldScaleBackground
    >
      <div className="p-4 min-h-[70vh] overflow-auto">
        {isLoading || !data ? (
          <p className="text-center text-muted-foreground">Загрузка...</p>
        ) : (
          <div className="flex gap-px bg-border border-b">
            <div className="flex flex-col pl-1 pr-4 bg-background">
              <div className="h-16"></div>
              <div className=" flex flex-col justify-end gap-8 text-muted text-sm">
                <p>Фаджр</p>
                <p>Зухр</p>
                <p>Аср</p>
                <p>Магриб</p>
                <p>Иша</p>
              </div>
            </div>
            <div className="flex-1 flex overflow-x-scroll bg-background">
              {data.map((item, index) => (
                <NamazCalendarDay key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomDrawer>
  );
};

const NamazCalendarDay = ({ item }: { item: INamazDataWithDate }) => {
  const formattedDate = Number(item.date.gregorian.date.slice(0, 2));
  const isToday = item.date.gregorian.date === format(new Date(), "dd-MM-yyyy");
  return (
    <div className="pl-4 last:pr-4">
      <p
        className={cn(
          "font-semibold pt-3 pb-8 text-sm text-center",
          !isToday && "text-muted"
        )}
      >
        {formattedDate}
      </p>
      <div
        className={cn(
          "flex flex-col gap-8 justify-center text-center text-sm",
          !isToday && "text-muted"
        )}
      >
        <p>{formatTime(item.timings.Fajr)}</p>
        <p>{formatTime(item.timings.Dhuhr)}</p>
        <p>{formatTime(item.timings.Asr)}</p>
        <p>{formatTime(item.timings.Maghrib)}</p>
        <p>{formatTime(item.timings.Isha)}</p>
        <p></p>
      </div>
    </div>
  );
};

export default NamazCalendarDrawer;
