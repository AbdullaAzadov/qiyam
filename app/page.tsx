import MainPage from '@/src/pages/Main/ui/mainPage';
import React from 'react';

const Main = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/praytime/coordinates?latitude=43.203575478153695&longitude=76.87025617384441`
  );
  const data = await res.json();

  if (data.code === 200) {
    return <MainPage timings={data.data.timings} />;
  }
};

export const dynamic = 'force-dynamic';

export default Main;
