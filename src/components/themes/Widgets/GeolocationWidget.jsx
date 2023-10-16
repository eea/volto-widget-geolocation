import React from 'react';
import cx from 'classnames';
import './public.less';

const GeolocationWidget = ({ value, className }) =>
  value?.geolocation ? (
    <ul className={cx(className, 'geolocation-widget', 'widget')}>
      {value.geolocation.map((item, index) => (
        <li key={index}>{item.label}</li>
      ))}
    </ul>
  ) : (
    ''
  );

export default GeolocationWidget;
