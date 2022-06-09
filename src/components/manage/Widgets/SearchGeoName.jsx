import React from 'react';
import InlineForm from './InlineForm';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { GeoSearchSchema as schema } from './schema';
import ListResults from './ListResults';
import { getGeonameSettings } from '@eeacms/volto-widget-geolocation/actions';
import worldSVG from '@plone/volto/icons/world.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import checkSVG from '@plone/volto/icons/check.svg';

export default (props) => {
  const { id, data, block, setPopup, onChange, onChangeSchema } = props;
  const [resultsValue, setResultsValue] = React.useState(data.geolocation);
  const InlineFormSchema = schema(props);
  const [searchUrl, setSearchUrl] = React.useState('');
  const [InlineFormData, setInlineFormData] = React.useState({}); //eea.coremetadata
  const subrequest = useSelector(
    (state) => state.content.subrequests,
    shallowEqual,
  );
  const geonamesUrl = Object.keys(subrequest).find(
    (item) => item === searchUrl,
  );
  const results = subrequest[geonamesUrl]?.data?.geonames;
  const loading = subrequest[geonamesUrl]?.loading;
  const dispatch = useDispatch();

  const saveResultsValue = (item) => {
    setResultsValue((prevState) => [
      ...(prevState || []),
      {
        label: item.toponymName,
        value: 'geo-' + item.geonameId,
      },
    ]);
  };

  const changeTaglist = (field, value) => {
    setResultsValue((prevState) =>
      field
        ? field.map((item) => ({
            label: item.label,
            value: item.value,
          }))
        : null,
    );
  };
  //componentDidMount
  React.useEffect(() => {
    dispatch(getGeonameSettings());
  }, [dispatch]);

  const onChangeValues = React.useCallback(
    (id, value) => {
      if (id === 'searchUrl') {
        setSearchUrl(value);
      } else if (onChangeSchema) {
        onChangeSchema(id, value);
      } else {
        onChange('geo_coverage', { ...data, [id]: value }); //eea.coremetadata: As we don't have blocksData here
      }
    },
    [onChangeSchema],
  );
  return (
    <InlineForm
      data={data}
      schema={InlineFormSchema}
      InlineFormData={InlineFormData}
      block={block}
      setValue={changeTaglist}
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
              onChange(
                id,
                Array.isArray(resultsValue) //eea.coremetadata behaviour #https://github.com/eea/eea.coremetadata/blob/develop/eea/coremetadata/interfaces.py#L130
                  ? { geolocation: resultsValue }
                  : resultsValue,
              );
              setPopup(false);
            }}
          >
            <VoltoIcon size="24px" name={checkSVG} />
          </button>
          <button
            onClick={() => {
              setPopup(false);
            }}
          >
            <VoltoIcon size="24px" name={clearSVG} />
          </button>
        </>
      }
      footer={
        results?.length && (
          <ListResults
            results={results}
            loading={loading}
            setValue={saveResultsValue}
            value={resultsValue}
          />
        )
      }
      {...props}
    />
  );
};
