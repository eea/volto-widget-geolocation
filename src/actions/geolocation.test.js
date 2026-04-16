import {
  getGeonameSettings,
  getGeoData,
} from './geolocation';
import {
  GET_GEONAMES,
  GET_GEODATA,
} from '@eeacms/volto-widget-geolocation/actionTypes';

describe('geolocation actions', () => {
  describe('getGeonameSettings', () => {
    it('creates the correct action', () => {
      const action = getGeonameSettings();
      expect(action.type).toBe(GET_GEONAMES);
      expect(action.request.op).toBe('get');
      expect(action.request.path).toBe('/@geolocation');
      expect(action.request.headers.Accept).toBe('application/json');
    });
  });

  describe('getGeoData', () => {
    it('creates the correct action', () => {
      const action = getGeoData();
      expect(action.type).toBe(GET_GEODATA);
      expect(action.request.op).toBe('get');
      expect(action.request.path).toBe('/@geodata');
      expect(action.request.headers.Accept).toBe('application/json');
    });
  });
});