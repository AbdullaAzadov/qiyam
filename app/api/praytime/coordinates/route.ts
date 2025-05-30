import { z } from 'zod';
import { format } from 'date-fns';

const requestSchema = z.object({
  latitude: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: 'latitude must be a number' })
    .refine((val) => val >= -90 && val <= 90, {
      message: 'latitude out of range',
    }),
  longitude: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: 'longitude must be a number' })
    .refine((val) => val >= -180 && val <= 180, {
      message: 'longitude out of range',
    }),
});

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const query = {
      latitude: url.searchParams.get('latitude') || '',
      longitude: url.searchParams.get('longitude') || '',
    };

    const { latitude, longitude } = requestSchema.parse(query);
    const today = format(new Date(), 'dd-MM-y');
    const method = 14;
    const tune = encodeURIComponent('0,8,-3,3,3,3,3,0,0');
    const timezone = encodeURIComponent('Asia/Almaty');
    const calendarMethod = 'UAQ'; // HJCoSA UAQ DIYANET MATHEMATICAL
    const iso8601 = true;

    const URI = `https://api.aladhan.com/v1/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=${method}&shafaq=general&tune=${tune}&school=1&timezonestring=${timezone}&calendarMethod=${calendarMethod}&iso8601=${iso8601}`;
    console.log(URI);

    const response = await fetch(URI);
    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), {
      status: 400,
    });
  }
};
