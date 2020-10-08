import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import { FormFieldWrapper } from '@plone/volto/components';

import Select, { components } from 'react-select';
import { biogeographicalData } from './biogeographical';
import { eeaCountries, eeaGroups } from './eeaCountries';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

const messages = defineMessages({
  coverage: {
    id: 'Geographic coverage',
    defaultMessage: 'Geographic coverage',
  },
  countries: {
    id: 'Select Countries',
    defaultMessage: 'Select Countries',
  },
});
let arr = [];
const groupedOptions = [
  {
    label: 'Biogeographical region',
    options: biogeographicalData,
  },
  {
    label: 'Countries group',
    options: arr,
  },
];
const Group = (props) => <components.Group {...props} />;

const GeolocationWidget = (props) => {
  const { data, block, onChangeBlock, intl } = props;
  const [selectedOption, setOption] = useState(null);
  const [selectCountry, setCountry] = useState(null);

  React.useEffect(() => {
    if (selectCountry) {
      arr = [];
      arr = eeaCountries.filter((item) =>
        item.group?.includes(selectCountry.label),
      );
      groupedOptions[1].options = arr;
    }
    onChangeBlock(block, {
      ...data,
      geolocation: selectedOption ? [...selectedOption] : data.geolocation,
    });
  }, [selectedOption, selectCountry]);

  return (
    <FormFieldWrapper {...props} columns={1}>
      <Grid>
        <Grid.Row stretched>
          <Grid.Column width="4">
            <div className="wrapper">
              <label htmlFor="select-listingblock-template">
                {intl.formatMessage(messages.countries)}
              </label>
            </div>
          </Grid.Column>
          <Grid.Column width="8" style={{ flexDirection: 'unset' }}>
            <Select
              defaultValue={selectCountry || []}
              id="select-listingblock-template"
              name="select-listingblock-template"
              className="react-select-container"
              classNamePrefix="react-select"
              options={eeaGroups}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              //value={selectedOption || []}
              onChange={(field, value) => {
                setCountry((prevState) =>
                  field ? { label: field.label, value: field.value } : null,
                );
              }}
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
              defaultValue={data.geolocation || []}
              isMulti
              id="select-listingblock-template"
              name="select-listingblock-template"
              className="react-select-container"
              classNamePrefix="react-select"
              options={groupedOptions}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option, Group }}
              //value={selectedOption || []}
              onChange={(field, value) => {
                setOption((prevState) =>
                  field
                    ? field.map((it) => {
                        return { label: it.label, value: it.value };
                      })
                    : null,
                );
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </FormFieldWrapper>
  );
};

GeolocationWidget.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string.isRequired,
  onChangeBlock: PropTypes.func.isRequired,
};

export default injectIntl(GeolocationWidget);
