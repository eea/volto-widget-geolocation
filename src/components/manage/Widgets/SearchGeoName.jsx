import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { ReactEditor } from 'slate-react';
// import { useFormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import { Icon as VoltoIcon } from '@plone/volto/components';
import briefcaseSVG from '@plone/volto/icons/briefcase.svg';
import { Popup, PopupContent } from 'semantic-ui-react';
import checkSVG from '@plone/volto/icons/check.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import InlineForm from 'volto-slate/futurevolto/InlineForm';
import { setPluginOptions } from 'volto-slate/actions';
import { GeoSearchSchema } from './schema';
import { getMentionWidget } from '@eeacms/volto-slate-metadata-mentions/plugins/Mentions/utils';

export default (props) => {
  const {
    editor,
    pluginId,
    getActiveElement,
    isActiveElement,
    insertElement,
    unwrapElement,
    hasValue,
  } = props;

  // Get Object metadata from global state
  const properties = useSelector(
    (state) => state?.schema?.schema?.properties || {},
  );

  // Get formData
  // const context = useFormStateContext();
  // const { contextData, setContextData } = context;
  // const metaData = contextData.formData;

  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({});
  const [editSchema, setEditSchema] = React.useState(GeoSearchSchema);

  const updateSchema = React.useCallback(
    (metaId) => {
      const extendedFields = metaId ? [metaId] : [];
      const extendedProperties = metaId ? { [metaId]: properties[metaId] } : {};

      setEditSchema({
        ...GeoSearchSchema,
        fieldsets: [
          ...GeoSearchSchema.fieldsets,
          {
            id: 'metadata',
            title: 'Metadata value',
            fields: extendedFields,
          },
        ],
        properties: {
          ...GeoSearchSchema.properties,
          id: {
            ...GeoSearchSchema.properties.id,
            choices: Object.keys(properties)
              .map((key) => {
                const val = properties[key];
                if (key !== 'id' && val?.type !== 'dict') {
                  return [key, val?.title || key];
                }
                return false;
              })
              .filter((val) => !!val),
          },
          ...extendedProperties,
        },
      });
    },
    [properties],
  );

  const onChangeValues = React.useCallback(
    (id, value) => {
      const metaData =
        editor.getBlockProps().metadata || editor.getBlockProps().properties;
      if (id === 'id') {
        setFormData({
          ...formData,
          [id]: value,
          widget: getMentionWidget(value, properties[value]),
          [value]: metaData[value],
        });
        updateSchema(value);
      } else {
        setFormData({
          ...formData,
          [id]: value,
        });
      }
    },
    [editor, properties, updateSchema, formData],
  );

  return (
    <Popup
      wide="very"
      position="right center"
      trigger={
        <span className="metadata mention edit">
          <p>safsf</p>
        </span>
      }
    >
      <PopupContent>
        <InlineForm
          schema={editSchema}
          title={editSchema.title}
          icon={<VoltoIcon size="24px" name={briefcaseSVG} />}
          onChangeField={(id, value) => {
            onChangeValues(id, value);
          }}
          formData={formData}
          headerActions={
            <>
              <button
                onClick={() => {
                  dispatch(
                    setPluginOptions(pluginId, { show_sidebar_editor: false }),
                  );
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={checkSVG} />
              </button>
              <button
                onClick={() => {
                  dispatch(
                    setPluginOptions(pluginId, { show_sidebar_editor: false }),
                  );
                  setFormData({});
                  ReactEditor.focus(editor);
                }}
              >
                <VoltoIcon size="24px" name={clearSVG} />
              </button>
            </>
          }
        />
      </PopupContent>
    </Popup>
  );
};
