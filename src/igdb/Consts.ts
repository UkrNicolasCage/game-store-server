const igdbURL = 'https://api.igdb.com/v4';
const headers = {
  "Accept-Encoding": "gzip,deflate,compress",
  Accept: 'text/plain',
  'Client-ID': process.env.TWICH_CLIENT_ID,
  Authorization: process.env.BEARER,
};

export { igdbURL, headers };
