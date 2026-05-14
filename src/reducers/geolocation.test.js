import {
  GET_GEONAMES,
  GET_GEODATA,
} from '@eeacms/volto-widget-geolocation/actionTypes';
import geolocation from './geolocation';

describe('geolocation reducer', () => {
  const initialState = {
    get: {
      loaded: false,
      loading: false,
      error: null,
    },
    api: null,
    data: null,
    subrequests: {},
  };

  it('returns the initial state', () => {
    const state = geolocation(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('handles GET_GEONAMES_PENDING', () => {
    const state = geolocation(initialState, {
      type: `${GET_GEONAMES}_PENDING`,
    });
    expect(state.get.loading).toBe(true);
    expect(state.get.loaded).toBe(false);
    expect(state.api).toBeNull();
  });

  it('handles GET_GEODATA_PENDING', () => {
    const state = geolocation(initialState, {
      type: `${GET_GEODATA}_PENDING`,
    });
    expect(state.get.loading).toBe(true);
    expect(state.get.loaded).toBe(false);
  });

  it('handles GET_GEONAMES_SUCCESS', () => {
    const result = { geonames: { password: 'test' } };
    const state = geolocation(initialState, {
      type: `${GET_GEONAMES}_SUCCESS`,
      result,
    });
    expect(state.api).toEqual(result);
    expect(state.get.loading).toBe(false);
    expect(state.get.loaded).toBe(true);
    expect(state.get.error).toBeNull();
  });

  it('handles GET_GEODATA_SUCCESS', () => {
    const result = {
      biotags: { ALP: { title: 'Alpine' } },
      geotags: {},
      country_mappings: {},
    };
    const state = geolocation(initialState, {
      type: `${GET_GEODATA}_SUCCESS`,
      result,
    });
    expect(state.data).toEqual(result);
    expect(state.get.loading).toBe(false);
    expect(state.get.loaded).toBe(true);
    expect(state.get.error).toBeNull();
  });

  it('handles GET_GEONAMES_FAIL', () => {
    const error = { message: 'Network error' };
    const state = geolocation(initialState, {
      type: `${GET_GEONAMES}_FAIL`,
      error,
    });
    expect(state.api).toBeNull();
    expect(state.get.loading).toBe(false);
    expect(state.get.loaded).toBe(false);
    expect(state.get.error).toEqual(error);
  });

  it('handles GET_GEODATA_FAIL', () => {
    const error = { message: 'Server error' };
    const state = geolocation(initialState, {
      type: `${GET_GEODATA}_FAIL`,
      error,
    });
    expect(state.data).toBeNull();
    expect(state.get.loading).toBe(false);
    expect(state.get.loaded).toBe(false);
    expect(state.get.error).toEqual(error);
  });

  it('preserves state for unknown action types', () => {
    const prev = { ...initialState, api: { some: 'data' } };
    const state = geolocation(prev, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(prev);
  });
});
