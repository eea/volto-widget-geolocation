import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import InlineForm from './InlineForm';

jest.mock('react-select', () => ({
  __esModule: true,
  default: ({ onChange, value = [] }) => (
    <button
      type="button"
      onClick={() => onChange([{ label: 'France', value: 'geo-fr' }])}
    >
      {value.map((item) => item.label).join(', ') || 'empty select'}
    </button>
  ),
}));

jest.mock('@plone/volto/components/manage/Widgets/SelectStyling', () => ({
  Option: () => null,
  DropdownIndicator: () => null,
  selectTheme: {},
  customSelectStyles: {},
}));

jest.mock('@plone/volto/components/manage/Form/Field', () => ({
  __esModule: true,
  default: ({ id, value, onChange, required, error }) => (
    <button type="button" onClick={() => onChange(id, `${value}-changed`)}>
      {id}:{required ? 'required' : 'optional'}:{error || 'valid'}
    </button>
  ),
}));

const schema = {
  fieldsets: [
    { id: 'default', title: 'Default', fields: ['search'] },
    { id: 'filters', title: 'Filters', fields: ['featureClass'] },
  ],
  properties: {
    search: { title: 'Search', default: 'initial' },
    featureClass: { title: 'Feature class', default: 'country' },
  },
  required: ['search'],
};

const renderInlineForm = (props) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <InlineForm
        schema={schema}
        data={{ featureClass: 'continent' }}
        setValue={jest.fn()}
        onChangeField={jest.fn()}
        {...props}
      />
    </IntlProvider>,
  );

describe('InlineForm', () => {
  it('renders fieldsets, messages, selected values and footer', () => {
    renderInlineForm({
      title: 'Advanced search',
      description: 'Describe this search',
      error: { message: 'Broken field' },
      errors: { search: 'Required' },
      value: [{ label: 'Romania', value: 'geo-ro' }],
      icon: <span>World</span>,
      headerActions: <button type="button">Close</button>,
      footer: <div>Footer results</div>,
    });

    expect(screen.getByText('Advanced search')).toBeTruthy();
    expect(screen.getByText('Describe this search')).toBeTruthy();
    expect(screen.getAllByText('Error')).toHaveLength(2);
    expect(screen.getByText('Broken field')).toBeTruthy();
    expect(screen.getByText('Romania')).toBeTruthy();
    expect(screen.getByText('search:required:Required')).toBeTruthy();
    expect(screen.getByText('featureClass:optional:valid')).toBeTruthy();
    expect(screen.getByText('Footer results')).toBeTruthy();
  });

  it('forwards select and field changes', () => {
    const setValue = jest.fn();
    const onChangeField = jest.fn();
    renderInlineForm({ setValue, onChangeField });

    fireEvent.click(screen.getByText('empty select'));
    fireEvent.click(screen.getByText('search:required:valid'));
    fireEvent.click(screen.getByText('featureClass:optional:valid'));

    expect(setValue).toHaveBeenCalledWith(
      [{ label: 'France', value: 'geo-fr' }],
      undefined,
    );
    expect(onChangeField).toHaveBeenCalledWith('search', 'initial-changed');
    expect(onChangeField).toHaveBeenCalledWith(
      'featureClass',
      'continent-changed',
    );
  });
});
