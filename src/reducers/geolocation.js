/**
 * Geolocation reducer.
 * @module reducers/geolocation/geolocation
 */
import { GET_GEONAMES } from '@eeacms/volto-widget-geolocation/actionTypes';

const initialState = {
  get: {
    loaded: false,
    loading: false,
    error: null,
  },
  api: null,
  subrequests: {},
};

/**
 * Get request key
 * @function getRequestKey
 * @param {string} actionType Action type.
 * @returns {string} Request key.
 */
function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

/**
 * Geolocation reducer.
 * @function content
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export function geolocation(state = initialState, action = {}) {
  let { result } = action;
  switch (action.type) {
    case `${GET_GEONAMES}_PENDING`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${GET_GEONAMES}_SUCCESS`:
      return {
        ...state,
        api: { ...result },
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${GET_GEONAMES}_FAIL`:
      return {
        ...state,
        api: null,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
