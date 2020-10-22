/**
 * Geolocation reducer.
 * @module reducers/geolocation/geolocation
 */

import { flattenToAppURL } from '@plone/volto/helpers';

import { GET_GEONAMES } from '@eeacms/volto-widget-geolocation/actionTypes';

const initialState = {
  get: {
    loaded: false,
    loading: false,
    error: null,
  },
  data: null,
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
export default function geolocation(state = initialState, action = {}) {
  let { result } = action;
  switch (action.type) {
    case `${GET_GEONAMES}_PENDING`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                ...(state.subrequests[action.subrequest] || {
                  data: null,
                }),
                loaded: false,
                loading: true,
                error: null,
              },
            },
          }
        : {
            ...state,
            [getRequestKey(action.type)]: {
              loading: true,
              loaded: false,
              error: null,
            },
          };
    case `${GET_GEONAMES}_SUCCESS`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                loading: false,
                loaded: true,
                error: null,
                data: {
                  ...result,
                  items:
                    action.result &&
                    action.result.items &&
                    action.result.items.map((item) => ({
                      ...item,
                      url: flattenToAppURL(item['@id']),
                    })),
                },
              },
            },
          }
        : {
            ...state,
            data: {
              ...result,
              items:
                action.result &&
                action.result.items &&
                action.result.items.map((item) => ({
                  ...item,
                  url: flattenToAppURL(item['@id']),
                })),
            },
            [getRequestKey(action.type)]: {
              loading: false,
              loaded: true,
              error: null,
            },
          };
    case `${GET_GEONAMES}_FAIL`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                data: null,
                loading: false,
                loaded: false,
                error: action.error,
              },
            },
          }
        : {
            ...state,
            data: null,
            [getRequestKey(action.type)]: {
              loading: false,
              loaded: false,
              error: action.error,
            },
          };
    default:
      return state;
  }
}
