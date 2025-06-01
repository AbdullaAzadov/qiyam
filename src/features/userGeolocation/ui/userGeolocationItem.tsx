import { IGeoSearchResponse } from '@/src/shared/api/addressApi';
import { Button } from '@/src/shared/cn/components/ui/button';
import { DialogClose } from '@/src/shared/cn/components/ui/dialog';
import React from 'react';

type Props = {
  location: IGeoSearchResponse;
  onSelectLocation: (location: IGeoSearchResponse) => void;
};

const UserGeolocationItem = ({ location, onSelectLocation }: Props) => {
  let regionalLabel =
    location.address.suburb || location.address.city || location.address.state;
  regionalLabel = `${regionalLabel || ''}${regionalLabel?.length ? ', ' : ''}${
    location.address.country
  }`;

  return (
    <DialogClose asChild onClick={() => onSelectLocation(location)}>
      <Button
        variant={'outline'}
        className='w-full h-fit bg-accent/40 flex flex-col items-start'
        autoFocus={false}
        tabIndex={-1}
      >
        <p className='font-semibold text-lg'>{location.name}</p>
        <span className='text-muted-foreground font-light'>
          {regionalLabel}
        </span>
      </Button>
    </DialogClose>
  );
};

export const UserGeolocationItemSkeleton = () => {
  return (
    <Button
      variant={'outline'}
      className='w-full h-fit bg-accent/100! animate-pulse flex flex-col items-start cursor-auto pointer-events-none '
    >
      <p className='text-lg text-transparent'>Loading...</p>
      <span className='text-transparent'>Loading...</span>
    </Button>
  );
};

export default UserGeolocationItem;
