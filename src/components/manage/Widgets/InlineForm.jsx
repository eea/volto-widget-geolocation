import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import React from 'react';
import Select from 'react-select';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import { keys, map } from 'lodash';
import { Field } from '@plone/volto/components';
import { Segment, Message, Card } from 'semantic-ui-react';

const messages = defineMessages({
  editValues: {
    id: 'Edit values',
    defaultMessage: 'Edit values',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  thereWereSomeErrors: {
    id: 'There were some errors',
    defaultMessage: 'There were some errors',
  },
});

const InlineForm = (props) => {
  const {
    block,
    data,
    setValue,
    description,
    value,
    error, // Such as {message: "It's not good"}
    errors = {},
    onChangeField,
    schema,
    title,
    icon,
    headerActions,
    footer,
    intl,
  } = props;
  const _ = intl.formatMessage;
  const defaultFieldset = schema.fieldsets.find((o) => o.id === 'default');
  const other = schema.fieldsets.filter((o) => o.id !== 'default');
  return (
    <Segment.Group className="form">
      <header className="header pulled">
        {icon}
        <h2>{title || _(messages.editValues)}</h2>
        {headerActions}
      </header>
      {description && (
        <Segment secondary className="attached">
          {description}
        </Segment>
      )}
      {keys(errors).length > 0 && (
        <Message
          icon="warning"
          negative
          attached
          header={_(messages.error)}
          content={_(messages.thereWereSomeErrors)}
        />
      )}
      {error && (
        <Message
          icon="warning"
          negative
          attached
          header={_(messages.error)}
          content={error.message}
        />
      )}
      <Segment>
        <Card fluid>
          <Select
            isClearable={true}
            isMulti={true}
            menuIsOpen={false}
            id="select-listingblock-template"
            name="select-listingblock-template"
            className="react-select-container"
            classNamePrefix="react-select"
            options={[]}
            styles={{
              ...customSelectStyles,
              dropdownIndicator: (styles) => ({
                display: 'none',
              }),
            }}
            theme={selectTheme}
            components={{ DropdownIndicator, Option }}
            value={value || []}
            onChange={(field, value) => {
              setValue(field, value);
            }}
          />
        </Card>
      </Segment>
      <div id={`blockform-fieldset-${defaultFieldset.id}`}>
        {map(defaultFieldset.fields, (field, index) => (
          <Field
            {...schema.properties[field]}
            id={field}
            fieldSet={defaultFieldset.title.toLowerCase()}
            focus={index === 0}
            value={data?.[field] || schema.properties[field]?.default}
            required={schema.required.indexOf(field) !== -1}
            onChange={(id, value) => {
              onChangeField(id, value);
            }}
            key={field}
            error={errors[field]}
            block={block}
            data={data}
          />
        ))}
      </div>

      {other.map((fieldset) => (
        <div key={fieldset.id} id={`blockform-fieldset-${fieldset.id}`}>
          {title && (
            <Segment className="secondary attached">{fieldset.title}</Segment>
          )}
          <Segment className="attached">
            {map(fieldset.fields, (field) => (
              <Field
                {...schema.properties[field]}
                id={field}
                value={data[field] || schema.properties[field].default}
                required={schema.required.indexOf(field) !== -1}
                onChange={(id, value) => {
                  onChangeField(id, value);
                }}
                key={field}
                error={errors[field]}
                block={block}
              />
            ))}
          </Segment>
        </div>
      ))}
      {footer}
    </Segment.Group>
  );
};

InlineForm.defaultProps = {
  block: null,
  description: null,
  onChangeField: null,
  error: null,
  errors: {},
  schema: {},
  data: {},
};

InlineForm.propTypes = {
  block: PropTypes.string,
  description: PropTypes.string,
  schema: PropTypes.shape({
    fieldsets: PropTypes.arrayOf(
      PropTypes.shape({
        fields: PropTypes.arrayOf(PropTypes.string),
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
    properties: PropTypes.objectOf(PropTypes.any),
    definitions: PropTypes.objectOf(PropTypes.any),
    required: PropTypes.arrayOf(PropTypes.string),
  }),
  data: PropTypes.objectOf(PropTypes.any),
  pathname: PropTypes.string,
  onChangeField: PropTypes.func,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

export default injectIntl(InlineForm, { forwardRef: true });
