export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const limit = url.searchParams.get('limit') || '';

    const URI = `https://nominatim.openstreetmap.org/search?q=${q}&format=jsonv2&addressdetails=1&limit=${limit}&accept-language=ru`;

    const response = await fetch(URI);
    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Invalid input ${error}` }), {
      status: 400,
    });
  }
};
