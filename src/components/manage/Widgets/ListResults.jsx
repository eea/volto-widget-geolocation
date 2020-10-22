import React from 'react';
import {
  Segment,
  Header,
  Dimmer,
  Grid,
  Loader,
  Accordion,
  Button,
} from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import rightSVG from '@plone/volto/icons/right-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';
import addSVG from '@plone/volto/icons/circle-plus.svg';

const ListResults = ({ results, loading, setValue, value }) => {
  const [activeAccIndex, setActiveAccIndex] = React.useState(0);

  function handleAccClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeAccIndex === index ? -1 : index;

    setActiveAccIndex(newIndex);
  }
  return (
    <Segment>
      <Header>Results</Header>
      {loading && (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )}
      <Accordion fluid styled exclusive={false}>
        {results?.map((item, index) => (
          <Accordion.Accordion style={{ borderBottom: '1px solid #c7cdd8' }}>
            <Accordion.Title
              active={activeAccIndex === 0}
              index={index}
              onClick={handleAccClick}
              style={{
                background: 'none',
                display: 'flex',
              }}
            >
              {item.toponymName}
              <div>
                <Button
                  basic
                  primary
                  floated="left"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      value?.find((val) => val.value === item.geonameId) ===
                      undefined
                    ) {
                      //results.splice(index, 1); do not remove result onClick
                      setValue((prevState) => [
                        ...(prevState || []),
                        { label: item.toponymName, value: item.geonameId },
                      ]);
                    }
                  }}
                >
                  <Icon name={addSVG} size="24px" color="#007eb1" />
                </Button>
                {activeAccIndex === index ? (
                  <Icon name={downSVG} size="24px" />
                ) : (
                  <Icon name={rightSVG} size="24px" />
                )}
              </div>
            </Accordion.Title>
            <Accordion.Content active={activeAccIndex === index}>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column>
                    <p>
                      <b>Feature set:</b> {item.fclName}
                    </p>
                    <p>
                      <b>Country:</b> {item.countryName}
                    </p>
                    <p>
                      <b>GeonameID:</b> {item.geonameId}
                    </p>
                  </Grid.Column>
                  <Grid.Column verticalAlign="middle">
                    <a
                      href={`https://www.geonames.org/${item.geonameId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button color="twitter" size="small" compact={true}>
                        Preview
                      </Button>
                    </a>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Accordion.Content>
          </Accordion.Accordion>
        ))}
      </Accordion>
    </Segment>
  );
};
export default ListResults;
