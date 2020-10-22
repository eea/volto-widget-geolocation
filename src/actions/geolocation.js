import { GET_GEONAMES } from '@eeacms/volto-widget-geolocation/actionTypes';
import { settings } from '@plone/volto/config';
/**
 * getGeonames function.
 * @function getGeonames
 * @param {url} url URL.
 * @returns {Object} Object.
 */
export function getGeonames(url, subrequest = null) {
  return {
    type: GET_GEONAMES,
    subrequest,
    request: {
      op: 'get',
      path: `/@geolocation`,
      headers: {
        Accept: 'application/json',
      },
    },
  };
}
