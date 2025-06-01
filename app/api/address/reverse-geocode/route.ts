import { z } from 'zod';

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

    const URI = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`;

    const response = await fetch(URI);
    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: `Invalid input ${error}` }), {
      status: 400,
    });
  }
};
