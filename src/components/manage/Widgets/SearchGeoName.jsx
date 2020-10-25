import React from 'react';
import InlineForm from './InlineForm';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { useSelector } from 'react-redux';
import { GeoSearchSchema as schema } from './schema';
import ListResults from './ListResults';
import { getFilteredResults } from './util';
import worldSVG from '@plone/volto/icons/world.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import checkSVG from '@plone/volto/icons/check.svg';

export default (props) => {
  const { data, block, closePopup, onChange } = props;
  const [resultsValue, setResultsValue] = React.useState(data.geolocation);

  const [content, subrequest] = useSelector((state) => [
    state.content.data,
    state.content.subrequests,
  ]);
  const [formData, setFormData] = React.useState(content.blocks[block]);
  const geonamesUrl = Object.keys(subrequest).find((item) =>
    item.includes(formData?.search || 'geonames'),
  );
  const loading = subrequest[geonamesUrl]?.loading;

  const results = subrequest[geonamesUrl]?.data?.geonames;

  React.useEffect(() => {
    getFilteredResults(results, formData);
  }, [formData]);

  const onChangeValues = React.useCallback(
    (id, value) => {
      setFormData({
        ...formData,
        [id]: value,
      });
    },
    [formData],
  );
  return (
    <InlineForm
      data={data}
      schema={schema}
      block={block}
      setValue={setResultsValue}
      value={resultsValue}
      title={schema.title}
      icon={<VoltoIcon size="24px" name={worldSVG} />}
      onChangeField={(id, value) => {
        return onChangeValues(id, value);
      }}
      formData={formData}
      headerActions={
        <>
          <button
            onClick={() => {
              onChange(resultsValue);
              closePopup(false);
            }}
          >
            <VoltoIcon size="24px" name={checkSVG} />
          </button>
          <button
            onClick={() => {
              closePopup(false);
            }}
          >
            <VoltoIcon size="24px" name={clearSVG} />
          </button>
        </>
      }
      footer={
        Object.keys(subrequest).length > 1 && (
          <ListResults
            results={results}
            loading={loading}
            setValue={setResultsValue}
            value={resultsValue}
          />
        )
      }
    />
  );
};
