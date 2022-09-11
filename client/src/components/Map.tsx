// @ts-ignore
import { ReactBingmaps } from 'react-bingmaps';
import { Flight } from 'real-time-flight-lib';

const airPlainSvg = (deg?: number) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
     width="32" height="32" viewBox="0 -30 100 150" xml:space="preserve" style="transform: rotateZ(${deg ?? 180 - 45}deg);">

<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
   transform="translate(1 1) scale(1 1)">
	<path d="M 47.022 11.983 l 2.42 -2.42 c 0.79 -0.79 0.79 -2.07 0 -2.86 l -3.521 -3.521 c -0.79 -0.79 -2.07 -0.79 -2.86 0 l -5.096 5.096 C 39.971 11.813 42.917 13.215 47.022 11.983 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(173,196,229); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
    <path d="M 81.722 52.035 l 5.096 -5.096 c 0.79 -0.79 0.79 -2.07 0 -2.86 l -3.521 -3.521 c -0.79 -0.79 -2.07 -0.79 -2.86 0 l -2.42 2.42 C 76.813 46.837 78.538 49.687 81.722 52.035 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(173,196,229); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
    <path d="M 56.371 15.83 L 21.504 1.544 c -2.352 -0.962 -5.042 -0.561 -7.011 1.045 L 8.668 7.341 C 7.571 8.236 7.599 9.922 8.726 10.78 l 30.82 23.769 C 49.091 30.74 54.539 24.402 56.371 15.83 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(199,210,227); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
    <path d="M 15.749 70.165 L 0.632 58.34 c -0.865 -0.679 -0.837 -1.997 0.056 -2.639 l 3.736 -2.683 c 1.343 -0.964 3.098 -1.139 4.604 -0.457 l 13.228 5.942 C 23.037 63.623 20.605 67.4 15.749 70.165 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(199,210,227); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
    <path d="M 55.451 50.454 l 23.769 30.82 c 0.858 1.127 2.544 1.155 3.439 0.058 l 4.752 -5.825 c 1.606 -1.969 2.007 -4.659 1.045 -7.011 L 74.17 33.629 C 66.047 37.702 59.483 43.045 55.451 50.454 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(199,210,227); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
    <path d="M 31.497 67.744 l 5.942 13.228 c 0.681 1.506 0.507 3.261 -0.457 4.604 l -2.683 3.736 c -0.641 0.893 -1.96 0.921 -2.639 0.056 L 19.835 74.251 C 23.332 70.226 27.217 68.047 31.497 67.744 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(199,210,227); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
    <path d="M 14.748 75.252 c 4.748 4.748 90.334 -55.5 72.917 -72.917 S 10 70.504 14.748 75.252 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(87,134,204); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
    <path d="M 75.91 7.864 c 0.553 -1.402 1.842 -2.408 3.284 -2.953 c 0.735 -0.269 1.547 -0.423 2.434 -0.358 c 0.874 0.062 1.883 0.401 2.657 1.163 c 0.763 0.773 1.102 1.782 1.166 2.657 c 0.064 0.888 -0.087 1.7 -0.358 2.436 c -0.544 1.443 -1.553 2.732 -2.957 3.283 c 0.458 -1.381 0.623 -2.615 0.65 -3.774 c 0.038 -1.153 -0.246 -2.147 -0.622 -2.481 c -0.331 -0.379 -1.329 -0.664 -2.481 -0.626 C 78.522 7.237 77.288 7.404 75.91 7.864 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(199,210,227); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
</g>
</svg>`

export const Map = (props: { flights: Flight[] }) => {
  // console.log('Map is rendered');
  const bingMapKey = 'AmupYCESFVSeS62fty-byYxUo7TISRBdnIKSWK7e9i02hzdWS6X4JB3iyz6nS74V';
  const TLV_LOCATION = {
    lat: 32.011379,
    lon: 34.886662,
  }

  const infoboxesWithPushPins = Object.values(props.flights)
      .filter(flight => flight?.trail?.length)
      .map(flight => ({
        location: [flight.trail?.at(0)?.latitude, flight.trail?.at(0)?.longitude],
        addHandler: 'click',
        infoboxOption: { description: `from ${flight.origin.city}\n to ${flight.destination.city}` },
        pushPinOption: { icon: airPlainSvg(flight.trail?.at(0)?.head) },
      }));

  // @ts-ignore
  infoboxesWithPushPins.push({
    location: [TLV_LOCATION.lat, TLV_LOCATION.lon],
    addHandler: 'click',
    infoboxOption: { description: `נתב"ג` },
    pushPinOption: { icon: '' }
  })

  return (
      <ReactBingmaps
          id="map"
          bingmapKey={bingMapKey}
          center={[TLV_LOCATION.lat, TLV_LOCATION.lon]}
          mapTypeId={"aerial"}
          zoom={5}
          infoboxesWithPushPins={infoboxesWithPushPins}
      />
  )
}
