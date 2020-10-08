import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import { FormFieldWrapper } from '@plone/volto/components';

import Select, { components } from 'react-select';
import { biogeographicalData } from './biogeographical';
import { eeaCountries } from './eeaCountries';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

const messages = defineMessages({
  Coverage: {
    id: 'Geographic coverage',
    defaultMessage: 'Geographic coverage',
  },
});
const groupedOptions = [
  {
    label: 'BioGeographical',
    options: biogeographicalData,
  },
  {
    label: 'EEA Countries',
    options: eeaCountries,
  },
];
const Group = (props) => <components.Group {...props} />;

const GeolocationWidget = (props) => {
  const { data, block, onChangeBlock, intl } = props;
  const [selectedOption, setOption] = useState(null);

  React.useEffect(() => {
    onChangeBlock(block, {
      ...data,
      geographic: selectedOption ? [...selectedOption] : data.geographic,
    });
  }, [selectedOption]);

  return (
    <FormFieldWrapper {...props} columns={1}>
      <Grid>
        <Grid.Row stretched>
          <Grid.Column width="4">
            <div className="wrapper">
              <label htmlFor="select-listingblock-template">
                {intl.formatMessage(messages.Coverage)}
              </label>
            </div>
          </Grid.Column>
          <Grid.Column width="8" style={{ flexDirection: 'unset' }}>
            <Select
              defaultValue={data.geographic || []}
              isMulti
              allowCreateWhileLoading={true}
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
