import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Segment } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import { unionBy, keys, isEmpty } from 'lodash';
import { getGeoData } from '@eeacms/volto-widget-geolocation/actions';
import { SidebarPopup } from '@plone/volto/components';

import Select, { components } from 'react-select';
import { getBioTags, getCountries } from './util';
import SearchGeoName from './SearchGeoName';
import { eeaCountries, countryGroups } from './eeaCountries';
import { biogeographicalData } from './biogeographical';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import zoomSVG from '@plone/volto/icons/zoom-in.svg';
import './public.less';

const messages = defineMessages({
  coverage: {
    id: 'Geographic coverage',
    defaultMessage: 'Geographic coverage',
  },
  group: {
    id: 'Geographic group',
    defaultMessage: 'Geographic group',
  },
  search: {
    id: 'Advance search',
    defaultMessage: 'Advance search',
  },
});
const Group = (props) => <components.Group {...props} />;

const GeolocationWidget = (props) => {
  const { data = {}, block, onChange, intl, onChangeSchema } = props;
  const [isOpenPopup, setPopup] = useState(false);
  const dispatch = useDispatch();
  const geoData = useSelector((state) => state.geolocation?.data || {});
  const { biotags = {}, geotags = {} } = geoData;
  React.useEffect(() => {
    dispatch(getGeoData());
  }, [dispatch]);

  let options = [
    {
      label: 'Biogeographical regions',
      options: !isEmpty(biotags) ? getBioTags(biotags) : biogeographicalData,
    },
    {
      label: 'Countries groups',
      options: !isEmpty(geotags) ? getCountries(geotags) : eeaCountries,
    },
  ];
  const eeaGroups = () => {
    return !isEmpty(geotags)
      ? keys(geotags).map((item) => ({
          label: item,
          value: item,
        }))
      : countryGroups;
  };
  const getOptions = (arr, state) => {
    return state ? unionBy(arr, state, 'label') : arr;
  };

  const handleChange = (e, value) => {
    let arr = [];
    if (isEmpty(geotags)) {
      arr = eeaCountries.filter((item) => item.group?.includes(e.label));
    } else {
      arr = keys(geotags[e.value])
        .filter((item) => item !== 'title')
        .map((item) =>
          item !== 'title'
            ? {
                value: item,
                label: geotags[e.value][item],
              }
            : '',
        );
    }
    onChange(getOptions(data.geolocation, arr));
  };

  return (
    <FormFieldWrapper
      {...props}
      id="geolocation"
      title="Geo Coverage"
      columns={1}
    >
      <Grid>
        <Grid.Row stretched>
          <Grid.Column width="4">
            <div className="wrapper">
              <label htmlFor="select-listingblock-template">
                {intl.formatMessage(messages.group)}
              </label>
            </div>
          </Grid.Column>
          <Grid.Column width="8" style={{ flexDirection: 'unset' }}>
            <Select
              defaultValue={[]}
              id="select-listingblock-template"
              name="select-listingblock-template"
              className="react-select-container"
              classNamePrefix="react-select"
              options={eeaGroups()}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              //value={selectedOption || []}
              onChange={(e, value) => handleChange(e, value)}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width="4">
            <div className="wrapper">
              <label htmlFor="select-listingblock-template">
                {intl.formatMessage(messages.coverage)}
              </label>
            </div>
          </Grid.Column>
          <Grid.Column width="8" style={{ flexDirection: 'unset' }}>
            <Select
              isMulti
              id="select-listingblock-template"
              name="select-listingblock-template"
              className="react-select-container"
              classNamePrefix="react-select"
              options={options}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option, Group }}
              value={data.geolocation}
              onChange={(field, value) => {
                onChange(field, value === '' ? undefined : value);
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Segment attached className="actions">
            <label className={'popup-label'}>
              {intl.formatMessage(messages.search)}
            </label>
            <Button
              basic
              primary
              floated="left"
              onClick={(name, value) => {
                setPopup(value);
              }}
            >
              <Icon
                name={zoomSVG}
                size="30px"
                className="addSVG"
                title={intl.formatMessage(messages.search)}
              />
            </Button>
          </Segment>
          <SidebarPopup open={isOpenPopup}>
            <SearchGeoName
              data={data}
              setPopup={setPopup}
              block={block}
              onChange={onChange}
              onChangeSchema={onChangeSchema}
            />
          </SidebarPopup>
        </Grid.Row>
      </Grid>
    </FormFieldWrapper>
  );
};

GeolocationWidget.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default injectIntl(GeolocationWidget);
