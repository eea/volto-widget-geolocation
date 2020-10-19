import React from 'react';
import InlineForm from 'volto-slate/futurevolto/InlineForm';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { List, Segment, Header } from 'semantic-ui-react';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import { useDispatch, useSelector } from 'react-redux';
import { GeoSearchSchema as schema } from './schema';
import worldSVG from '@plone/volto/icons/world.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

export default (props) => {
  const { data, onChangeValues, block, closePopup } = props;
  const [editSchema, setEditSchema] = React.useState(schema);
  const dispatch = useDispatch();
  const subrequest = useSelector((state) => state.content.subrequests);
  const [formData, setFormData] = React.useState({});
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
  return (
    <InlineForm
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
      footer={
        Object.keys(subrequest).length > 1 && (
          <Segment>
            <Header>Filter results</Header>
            <List relaxed>
              {subrequest[Object.keys(subrequest).pop()]?.data?.geonames?.map(
                (item) => (
                  <List.Item>
                    <List.Content>
                      <List.Header>{item.toponymName}</List.Header>
                      <List.Description>{item.fclName}</List.Description>
                    </List.Content>
                  </List.Item>
                ),
              )}
            </List>
          </Segment>
        )
      }
    />
  );
};
