import React from 'react';
import InlineForm from 'volto-slate/futurevolto/InlineForm';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { GeoSearchSchema as schema } from './schema';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

export default (props) => {
  const { data, onToggle, onChangeValues, block, closePopup } = props;

  const [formData, setFormData] = React.useState({});

  return (
    <InlineForm
      footer={<p>{''}</p>}
      schema={schema}
      block={block}
      title={schema.title}
      icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
      onChangeField={(id, value) => {
        if (!onChangeValues) {
          return setFormData({
            ...formData,
            [id]: value,
          });
        }
        return onChangeValues(id, value, formData, setFormData);
      }}
      formData={formData}
      headerActions={
        <>
          <button
            onClick={() => {
              closePopup(false);
            }}
          >
            <VoltoIcon size="24px" name={clearSVG} />
          </button>
        </>
      }
    />
  );
};
