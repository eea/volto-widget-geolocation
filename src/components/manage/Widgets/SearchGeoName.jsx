import React from 'react';
import InlineForm from './InlineForm';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { List, Segment, Header } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { GeoSearchSchema as schema } from './schema';
import ListResults from './ListResults';
import worldSVG from '@plone/volto/icons/world.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import checkSVG from '@plone/volto/icons/check.svg';

export default (props) => {
  const { data, block, closePopup, onChange } = props;
  const [editSchema, setEditSchema] = React.useState(schema);
  const [content, subrequest] = useSelector((state) => [
    state.content.data,
    state.content.subrequests,
  ]);
  const loading = subrequest[Object.keys(subrequest).pop()]?.loading;
  const results = subrequest[Object.keys(subrequest).pop()]?.data?.geonames;
  const [formData, setFormData] = React.useState(content.blocks[block]);
  // const url =
  //   'https://secure.geonames.org/searchJSON?username=nileshgulia&q=CONT';

  const updateSchema = React.useCallback(() => {
    setEditSchema({
      ...schema,
      properties: {
        ...schema.properties,
        continents: {
          ...schema.properties.continents,
          choices: subrequest[url]?.data?.geonames?.map((item) => [
            item.name,
            item.name,
          ]),
        },
      },
    });
  }, [editSchema, subrequest]);

  const onChangeValues = React.useCallback(
    (id, value) => {
      if (id === 'id') {
        setFormData({
          ...formData,
          [id]: value,
          widget: '',
          [value]: '',
        });
        updateSchema(value);
      } else {
        setFormData({
          ...formData,
          [id]: value,
        });
      }
    },
    [updateSchema, formData],
  );
  return (
    <InlineForm
      data={data}
      schema={editSchema}
      block={block}
      title={editSchema.title}
      icon={<VoltoIcon size="24px" name={worldSVG} />}
      onChangeField={(id, value) => {
        if (!onChangeValues) {
          return setFormData({
            ...formData,
            [id]: value,
          });
        }
        return onChangeValues(id, value);
      }}
      formData={formData}
      headerActions={
        <>
          <button onClick={() => {}}>
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
            onChange={onChange}
            loading={loading}
          />
        )
      }
    />
  );
};
