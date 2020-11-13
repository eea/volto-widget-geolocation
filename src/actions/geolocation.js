import { GET_GEONAMES } from '@eeacms/volto-widget-geolocation/actionTypes';
/**
 * getGeonames function.
 * @function getGeonames
 * @param {url} url URL.
 * @returns {Object} Object.
 */
export function getGeonames() {
  return {
    type: GET_GEONAMES,
    request: {
      op: 'get',
      path: `/@geolocation`,
      headers: {
        Accept: 'application/json',
      },
    },
  };
}
