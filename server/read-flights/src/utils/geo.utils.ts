export const getGeoDistance = (source: { lat: number; lon: number }, dest: { lat: number; lon: number }) => {
  const R = 6371; // Radius of the earth in KM
  const dLat = deg2rad(dest.lat-source.lat);
  const dLon = deg2rad(dest.lon-source.lon);
  const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(source.lat)) * Math.cos(deg2rad(dest.lat)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};
