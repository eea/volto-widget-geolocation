/**
 * Search widget component.
 * @module components/theme/SearchWidget/SearchWidget
 */

import React, { useState } from 'react';
import { Form, Input } from 'semantic-ui-react';
import { compose } from 'redux';

import { connect, useDispatch, useSelector } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';
import { Icon } from '@plone/volto/components';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import zoomSVG from '@plone/volto/icons/zoom.svg';

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
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const onSubmit = async (event) => {
    event.preventDefault();
    let url = `https://secure.geonames.org/searchJSON?q=${text}&maxRows=10&username=nileshgulia`;
    await dispatch(
      getProxiedExternalContent(url, {
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
