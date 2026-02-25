export async function onRequestGet(context) {
  const { env, params } = context;
  const clientId = env.CLIENT_ID;
  const clientSecret = env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(JSON.stringify({ error: 'Missing CLIENT_ID or CLIENT_SECRET environment variable.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!tokenResponse.ok) {
    return new Response(JSON.stringify({ error: 'Failed to authenticate with Spotify.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { access_token: accessToken } = await tokenResponse.json();
  const searchQuery = encodeURIComponent(`genre:${params.genre}`);

  const tracksResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=50`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!tracksResponse.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tracks from Spotify.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const tracksData = await tracksResponse.json();
  const allowedFields = ['artists', 'external_urls', 'name', 'popularity', 'uri'];

  const sortedTracks = (tracksData?.tracks?.items || []).sort(
    (a, b) => b.popularity - a.popularity || Date.parse(b.album.release_date) - Date.parse(a.album.release_date)
  );

  const filteredTracks = sortedTracks.map((track) =>
    Object.fromEntries(allowedFields.map((field) => [field, track[field]]))
  );

  return new Response(JSON.stringify(filteredTracks), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600'
    }
  });
}
