import {
  GET_GEONAMES,
  GET_GEODATA,
} from '@eeacms/volto-widget-geolocation/actionTypes';
/**
 * getGeonames function.
 * @function getGeonames
 * @param {url} url URL.
 * @returns {Object} Object.
 */
export function getGeonameSettings() {
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

export function getGeoData() {
  return {
    type: GET_GEODATA,
    request: {
      op: 'get',
      path: `/@geodata`,
      headers: {
        Accept: 'application/json',
      },
    },
  };
}
