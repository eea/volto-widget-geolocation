import React from 'react';
import cx from 'classnames';
import Popup from '@eeacms/volto-eea-design-system/ui/Popup/Popup';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getGeoData } from '@eeacms/volto-widget-geolocation/actions';
import { getGeoGroupsCoverage } from '@eeacms/volto-widget-geolocation/components/manage/Widgets/util';
import './public.less';

const messages = defineMessages({
  countriesInGroup: {
    id: 'Countries in {group}',
    defaultMessage: 'Countries in {group}',
  },
});

const EMPTY_OBJECT = Object.freeze({});

const renderFlatItems = (items) =>
  items.map((item, index) => <li key={item.value || index}>{item.label}</li>);

const InlineSeparator = ({ show }) =>
  show ? <span className="geolocation-separator">, </span> : null;

const GroupPopupContent = ({ countries }) => (
  <span className="geolocation-group-countries">
    {countries.map((country) => country.label).join(', ')}
  </span>
);

const GeolocationWidget = ({ value, className, flat = false }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const geoStatus = useSelector(
    (state) => state.geolocation?.get ?? EMPTY_OBJECT,
  );
  const geoData = useSelector(
    (state) => state.geolocation?.data ?? EMPTY_OBJECT,
  );
  const { geotags = {}, country_mappings = {} } = geoData;
  const geolocation = value?.geolocation;
  const hasGeotags = Object.keys(geotags).length > 0;

  React.useEffect(() => {
    if (
      !flat &&
      !hasGeotags &&
      !geoStatus.loading &&
      !geoStatus.loaded &&
      !geoStatus.error
    ) {
      dispatch(getGeoData());
    }
  }, [
    dispatch,
    flat,
    geoStatus.error,
    geoStatus.loaded,
    geoStatus.loading,
    hasGeotags,
  ]);

  if (!geolocation) return '';

  if (flat) {
    return (
      <ul className={cx(className, 'geolocation-widget', 'widget')}>
        {renderFlatItems(geolocation)}
      </ul>
    );
  }

  if (!hasGeotags) {
    return (
      <div className={cx(className, 'geolocation-widget', 'widget')}>
        {geolocation.map((item, index) => (
          <React.Fragment key={item.value || index}>
            <span className="geolocation-item">{item.label}</span>
            <InlineSeparator show={index < geolocation.length - 1} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  const { groups, ungrouped } = getGeoGroupsCoverage(
    geolocation,
    [],
    geotags,
    country_mappings,
  );
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
