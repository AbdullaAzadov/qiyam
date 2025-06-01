import { IGeoSearchResponse } from '@/src/shared/api/addressApi';
import { cn } from '@/src/shared/cn/lib/utils';
import { MapPinXIcon } from 'lucide-react';
import UserGeolocationItem, {
  UserGeolocationItemSkeleton,
} from './userGeolocationItem';

type Props = {
  renderData: IGeoSearchResponse[];
  renderingRecentlyLocations: boolean;
  isFetching: boolean;
  onSelectLocation: (location: IGeoSearchResponse) => void;
  query: string;
};

const ITEMS_LIMIT = 8;

const UserGeolocationList = ({
  onSelectLocation,
  isFetching,
  renderingRecentlyLocations,
  renderData,
  query,
}: Props) => {
  return (
    <div className={cn('overflow-y-auto space-y-4 h-full')}>
      {renderingRecentlyLocations && !isFetching && (
        <p>Популярные местоположения</p>
      )}
      {isFetching ? (
        <LocationListLoading count={4} />
      ) : (
        <LocationsList data={renderData} onSelectLocation={onSelectLocation} />
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

export default UserGeolocationList;
