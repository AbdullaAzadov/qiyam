'use client';
import {
  IGeoSearchResponse,
  useSearchCityByNameQuery,
} from '@/src/shared/api/addressApi';
import { Button } from '@/src/shared/cn/components/ui/button';
import { Input } from '@/src/shared/cn/components/ui/input';
import { cn } from '@/src/shared/cn/lib/utils';
import { debounce } from 'lodash';
import { MapPinIcon, MapPinXIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import UserGeolocationItem, {
  UserGeolocationItemSkeleton,
} from './userGeolocationItem';
import { DialogClose } from '@/src/shared/cn/components/ui/dialog';
import { RecentlyLocations } from '../model/data';

type Props = {
  onSelectLocation: (location: IGeoSearchResponse) => void;
  onFetchGPS: () => void;
};

const ITEMS_LIMIT = 8;

const UserGeolocation = ({ onSelectLocation, onFetchGPS }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
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
    <div className='flex flex-col gap-6 h-full'>
      <div className='flex items-center gap-2 h-9'>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Введите местоположение...'
          className='h-full'
        />
        <DialogClose onClick={onFetchGPS} asChild>
          <Button size={'icon'}>
            <MapPinIcon className='size-5 stroke-2 stroke-primary-foreground' />
          </Button>
        </DialogClose>
      </div>
      <hr />
      <div className={cn('overflow-y-auto space-y-4 flex-1')}>
        {renderingRecentlyLocations && !isFetching && (
          <p>Популярные местоположения</p>
        )}
        {isFetching ? (
          <LocationListLoading count={4} />
        ) : (
          <LocationsList
            data={renderData}
            onSelectLocation={onSelectLocation}
          />
        )}
        {renderData.length === 0 && !isFetching && (
          <div className='flex items-center gap-3 justify-center h-full font-light text-muted-foreground'>
            <MapPinXIcon className='size-8 stroke-2' />
            <span>
              Ничего не найдено <br /> по запросу &quot;{query}&quot;
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

type listProps = {
  data: IGeoSearchResponse[];
  onSelectLocation: (location: IGeoSearchResponse) => void;
};

const LocationsList = ({ data, onSelectLocation }: listProps) => {
  return data.map((location, index) => {
    if (index >= ITEMS_LIMIT) return null;
    return (
      <UserGeolocationItem
        key={index}
        location={location}
        onSelectLocation={onSelectLocation}
      />
    );
  });
};

const LocationListLoading = ({ count }: { count: number }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => {
        return <UserGeolocationItemSkeleton key={index} />;
      })}
    </>
  );
};

export default UserGeolocation;
