import NamazTimeCard from '@/src/features/namazTime/ui/namazTimeCard';
import QiblaDetector from '@/src/features/qiblaDetector/ui/qiblaDetector';

const MainPage = () => {
  return (
    <div className='p-4'>
      <NamazTimeCard />
      <QiblaDetector />
    </div>
  );
};

export default MainPage;
