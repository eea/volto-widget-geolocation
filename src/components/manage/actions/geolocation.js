import { geonames } from '../../../';
import { GET_CONTINENTS } from '../actionTypes';
export const getContinents = (url) => {
  return {
    type: GET_CONTINENTS,
    request: {
      op: 'get',
      path: url,
      headers: {
        Accept: 'application/json',
      },
    },
  };
};
