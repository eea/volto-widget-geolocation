import React from 'react';
import InlineForm from './InlineForm';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { useSelector, shallowEqual } from 'react-redux';
import { GeoSearchSchema as schema } from './schema';
import ListResults from './ListResults';
import { getFilteredResults } from './util';
import worldSVG from '@plone/volto/icons/world.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import checkSVG from '@plone/volto/icons/check.svg';
import search from '../../../../../../../omelette/src/reducers/search/search';

export default (props) => {
  const { data, block, closePopup, onChange, onChangeSchema } = props;
  const [resultsValue, setResultsValue] = React.useState(data.geolocation);
  const subrequest = useSelector(
    (state) => state.content.subrequests,
    shallowEqual,
  );
  const geonamesUrl = Object.keys(subrequest).find((item) =>
    item.includes(data?.searchUrl),
  );
  const results = subrequest[geonamesUrl]?.data?.geonames;
  const loading = subrequest[geonamesUrl]?.loading;

  const onChangeValues = React.useCallback(
    (id, value) => {
      onChangeSchema(value, id);
    },
    [onChangeSchema],
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
