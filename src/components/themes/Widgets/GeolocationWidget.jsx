import React from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import { sortByLabel } from '../../manage/Widgets/util';
import './public.less';

const messages = defineMessages({
  countriesInGroup: {
    id: 'Countries in {group}',
    defaultMessage: 'Countries in {group}',
  },
});

const renderFlatItems = (items) =>
  items.map((item, index) => <li key={item.value || index}>{item.label}</li>);

const InlineSeparator = ({ show }) =>
  show ? <span className="geolocation-separator">, </span> : null;

const GroupPopupContent = ({ countries }) => (
  <span className="geolocation-group-countries">
    {sortByLabel(countries)
      .map((country) => country.label)
      .join(', ')}
  </span>
);

const GeolocationWidget = ({ value, className, flat = false }) => {
  const intl = useIntl();
  const geolocation = value?.geolocation;
  const groupedGeolocation = value?.grouped_geolocation;

  if (!geolocation) return '';

  if (flat) {
    return (
      <ul className={cx(className, 'geolocation-widget', 'widget')}>
        {renderFlatItems(geolocation)}
      </ul>
    );
  }

  if (!groupedGeolocation) {
    return (
      <ul className={cx(className, 'geolocation-widget', 'widget')}>
        {renderFlatItems(geolocation)}
      </ul>
    );
  }

  const { groups = [], ungrouped = [] } = groupedGeolocation;
  const inlineItems = [
    ...groups.map((group) => ({ ...group, isGroup: true })),
    ...ungrouped.map((item) => ({ ...item, isGroup: false })),
  ];

  return (
    <div className={cx(className, 'geolocation-widget', 'widget')}>
      {inlineItems.map((item, index) => (
        <React.Fragment key={item.value || index}>
          {item.isGroup ? (
            <Popup
              on="click"
              position="top center"
              size="large"
              className="geolocation-group-popup"
              trigger={
                <button
                  type="button"
                  className="geolocation-group-trigger"
                  aria-label={intl.formatMessage(messages.countriesInGroup, {
                    group: item.label,
                  })}
                >
                  {item.label}
                </button>
              }
              content={<GroupPopupContent countries={item.countries} />}
            />
          ) : (
            <span className="geolocation-item">{item.label}</span>
          )}
          <InlineSeparator show={index < inlineItems.length - 1} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default GeolocationWidget;
