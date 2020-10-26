/**
 * Search widget component.
 * @module components/theme/SearchWidget/SearchWidget
 */

import React, { useState } from 'react';
import { Form, Input } from 'semantic-ui-react';
import { compose } from 'redux';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';
import { Icon } from '@plone/volto/components';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import { getCountryCode } from './util';
import countries from 'i18n-iso-countries';
import zoomSVG from '@plone/volto/icons/zoom.svg';
import locales from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(locales);

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  searchSite: {
    id: 'Search for geoTags',
    defaultMessage: 'Search for geoTags',
  },
});

/**
 * SearchWidget component class.
 * @class SearchWidget
 * @extends Component
 */
const SearchWidget = (props) => {
  const { onChange, value, data, id } = props;
  const { countries } = data;
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const password = useSelector(
    (state) => state.geolocation?.api?.geonames.password,
  );
  const subrequests = useSelector(
    (state) => state.content.subrequests,
    shallowEqual,
  );
  const onSubmit = async (event) => {
    event.preventDefault();
    let countryCode;
    if (/\d/.test(countries)) {
      let url = `https://secure.geonames.org/getJSON?geonameId=${
        countries.split('-')[1]
      }&username=${password}`;
      let response = await dispatch(
        getProxiedExternalContent(url, {
          headers: { Accept: 'application/json' },
        }),
      );
      countryCode = response.countryCode;
    } else {
      countryCode = getCountryCode(countries);
    }
    let searchUrl = `https://secure.geonames.org/searchJSON?q=${text}&country=${
      countryCode || ''
    }&maxRows=10&username=${password}`;
    onChange('searchUrl', searchUrl);
    await dispatch(
      getProxiedExternalContent(searchUrl, {
        headers: { Accept: 'application/json' },
      }),
    );
  };

  return (
    <Form onSubmit={onSubmit}>
      <FormFieldWrapper {...props} column={1}>
        <div>
          <Input
            style={{ width: '80%' }}
            aria-label={props.intl.formatMessage(messages.search)}
            onChange={(e) => setText(e.target.value)}
            name="SearchableText"
            value={text}
            autoComplete="off"
            placeholder={props.intl.formatMessage(messages.searchSite)}
            title={props.intl.formatMessage(messages.search)}
          />
          <button
            aria-label={props.intl.formatMessage(messages.search)}
            style={{ verticalAlign: 'middle' }}
            onClick={onSubmit}
          >
            <Icon name={zoomSVG} size="24px" />
          </button>
        </div>
      </FormFieldWrapper>
    </Form>
  );
};
export default compose(injectIntl)(SearchWidget);
