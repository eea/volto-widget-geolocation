import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Segment } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { FormFieldWrapper, Icon, SidebarPopup } from '@plone/volto/components';
import { unionBy, keys, isEmpty } from 'lodash';
import { getGeoData } from '@eeacms/volto-widget-geolocation/actions';
import { GeolocationWidgetView } from '@eeacms/volto-widget-geolocation/components';
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
    id: 'Advanced search',
    defaultMessage: 'Advanced search',
  },
});

const getOptions = (arr, state) => {
  return state ? unionBy(arr, state, 'label') : arr;
};

const Group = (props) => <components.Group {...props} />;

const GeolocationWidget = (props) => {
  const { id, value = {}, block, onChange, intl, onChangeSchema } = props;
  const originalValue = value;

  const [isOpenPopup, setPopup] = useState(false);
  const dispatch = useDispatch();
  const geoData = useSelector((state) => state.geolocation?.data || {});
  const { biotags = {}, geotags = {}, country_mappings = {} } = geoData;

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
      options: !isEmpty(geotags)
        ? getCountries(geotags, country_mappings)
        : eeaCountries,
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

  const handleGroupChange = (selectedOption) => {
    if (!selectedOption) {
      onChange(id, {
        ...originalValue,
        geolocation: [],
        selectedGroup: null,
      });
      return;
    }
    const { label, value } = selectedOption;
    let arr = [];
    if (isEmpty(geotags)) {
      arr = eeaCountries.filter((item) => item.group?.includes(label));
    } else {
      const countries = geotags[value] || {};
      arr = keys(countries)
        .filter((item) => item !== 'title')
        .map((item) => {
          if (keys(country_mappings).includes(countries[item])) {
            return {
              value: item,
              label: country_mappings[countries[item]],
            };
          } else {
            return {
              value: item,
              label: countries[item],
            };
          }
        });
    }
    onChange(id, {
      ...originalValue,
      geolocation: getOptions(originalValue.geolocation, arr),
      selectedGroup: selectedOption,
    });
  };

  const _groupId = `${id}-select-listingblock-template-group`;
  const _coverageId = `${id}-select-listingblock-template-coverage`;

  return (
    <FormFieldWrapper
      {...props}
      title={props.title || 'Geographic coverage'}
      className="geo-field-wrapper"
      columns={1}
    >
      <Grid>
        {originalValue?.readOnly ? (
          <Grid.Row stretched>
            <Grid.Column width="4">
              <div className="wrapper">
                <label htmlFor="select-listingblock-template">
                  {intl.formatMessage(messages.coverage)}
                </label>
              </div>
            </Grid.Column>
            <Grid.Column width="8" style={{ flexDirection: 'unset' }}>
              <GeolocationWidgetView
                value={originalValue}
                className="read-only"
              />
            </Grid.Column>
          </Grid.Row>
        ) : (
          <>
            <Grid.Row stretched>
              <Grid.Column width="4">
                <div className="wrapper">
                  <label htmlFor={`${id}-select-listingblock-template-group`}>
                    {intl.formatMessage(messages.group)}
                  </label>
                </div>
              </Grid.Column>
              <Grid.Column width="8" style={{ flexDirection: 'unset' }}>
                <Select
                  id={_groupId}
                  name={_groupId}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={eeaGroups()}
                  styles={customSelectStyles}
                  theme={selectTheme}
                  components={{ DropdownIndicator, Option }}
                  value={originalValue.selectedGroup || []}
                  onChange={handleGroupChange}
                  isClearable={!!originalValue.selectedGroup}
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
                  id={_coverageId}
                  name={_coverageId}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={options}
                  styles={customSelectStyles}
                  theme={selectTheme}
                  components={{ DropdownIndicator, Option, Group }}
                  value={value.geolocation || []}
                  onChange={(geolocation) => {
                    onChange(
                      id,
                      geolocation === ''
                        ? { ...value, geolocation: undefined }
                        : { ...value, geolocation },
                    );
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
                  size="mini"
                  basic
                  primary
                  floated="left"
                  onClick={(event) => {
                    setPopup(true);
                    event.preventDefault();
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
                  id={id}
                  data={value}
                  setPopup={setPopup}
                  block={block}
                  onChange={onChange}
                  onChangeSchema={onChangeSchema}
                />
              </SidebarPopup>
            </Grid.Row>
          </>
        )}
      </Grid>
    </FormFieldWrapper>
  );
};

GeolocationWidget.propTypes = {
  // data: PropTypes.objectOf(PropTypes.any).isRequired,
  // value: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default injectIntl(GeolocationWidget);
