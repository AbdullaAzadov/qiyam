"use client";
import {
  IGeoSearchResponse,
  useSearchCityByNameQuery,
} from "@/src/shared/api/addressApi";
import CustomDialog from "@/src/shared/ui/customDialog";
import { MapPinIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import UserLocationAddressesList from "./userLocationAddressesList";
import { debounce } from "lodash";
import { RecentlyLocations } from "../model/data";
import { Input } from "@/src/shared/cn/components/ui/input";
import { DialogClose } from "@/src/shared/cn/components/ui/dialog";
import { Button } from "@/src/shared/cn/components/ui/button";

type Props = {
  trigger: React.ReactNode;
  onFetchGPS: () => void;
  onSelectLocation: (location: IGeoSearchResponse) => void;
};

const ITEMS_LIMIT = 8;

const UserLocationModal = ({
  trigger,
  onFetchGPS,
  onSelectLocation,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const { data, isFetching, refetch, isSuccess } = useSearchCityByNameQuery(
    { q: query, limit: ITEMS_LIMIT },
    { skip: query.length < 2 }
  );

  const debouncedSetQuery = useMemo(
    () => debounce((val: string) => setQuery(val), 500),
    []
  );

  useEffect(() => {
    debouncedSetQuery(inputValue);
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [inputValue, debouncedSetQuery]);

  useEffect(() => {
    if (query.length > 2) {
      refetch();
    }
  }, [query, refetch]);

  const renderingRecentlyLocations =
    (!isFetching && !isSuccess) || query.length < 2;
  let renderData: IGeoSearchResponse[] = [];
  if (!isFetching) renderData = RecentlyLocations;
  if (isSuccess && query.length >= 2) renderData = data;

  return (
    <CustomDialog
      trigger={trigger}
      header={{
        title: "Ваше местоположение",
        children: (
          <>
            <div className="flex items-center gap-2 h-9">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Введите местоположение..."
                className="h-full"
                autoFocus={false}
                tabIndex={-1}
              />
              <DialogClose onClick={onFetchGPS} asChild>
                <Button size={"icon"} autoFocus={false} tabIndex={-1}>
                  <MapPinIcon className="size-5 stroke-2 stroke-primary-foreground" />
                </Button>
              </DialogClose>
            </div>
            <hr className="mt-1" />
          </>
        ),
      }}
      mobileMode
    >
      <UserLocationAddressesList
        renderData={renderData}
        renderingRecentlyLocations={renderingRecentlyLocations}
        isFetching={isFetching}
        query={query}
        onSelectLocation={onSelectLocation}
      />
    </CustomDialog>
  );
};

export default UserLocationModal;
