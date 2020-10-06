import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Form } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import CreatableSelect from 'react-select/creatable';
import { FormFieldWrapper } from '@plone/volto/components';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

const messages = defineMessages({
  Coverage: {
    id: 'Geometric coverage',
    defaultMessage: 'Geometric coverage',
  },
});

const GeolocationWidget = (props) => {
  const { data, block, onChangeBlock, intl } = props;
  const [selectedOption, setOption] = useState(null);
  React.useEffect(() => {
    onChangeBlock(block, {
      ...data,
      geographic: selectedOption
        ? [...data.geographic, selectedOption]
        : data.geographic,
    });
  }, [selectedOption]);

  if (data.geographic) {
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
              <CreatableSelect
                allowCreateWhileLoading={true}
                id="select-listingblock-template"
                name="select-listingblock-template"
                className="react-select-container"
                classNamePrefix="react-select"
                options={data && data.geographic}
                styles={{ ...customSelectStyles, paddingTop: '20px' }}
                theme={selectTheme}
                components={{ DropdownIndicator, Option }}
                value={selectedOption || []}
                onCreateOption={(field, value) => {
                  setOption((prevState) =>
                    field ? { label: field, value: field } : null,
                  );
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </FormFieldWrapper>
    );
  }

  return <></>;
};

GeolocationWidget.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string.isRequired,
  onChangeBlock: PropTypes.func.isRequired,
};

export default injectIntl(GeolocationWidget);
