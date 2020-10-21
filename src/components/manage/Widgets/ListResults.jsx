import React from 'react';
import {
  List,
  Segment,
  Header,
  Menu,
  Dimmer,
  Grid,
  Loader,
  Accordion,
  Label,
  Image,
  Card,
  Button,
} from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import rightSVG from '@plone/volto/icons/right-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';
import addSVG from '@plone/volto/icons/circle-plus.svg';

const ListResults = ({ results, onChange, loading }) => {
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
      {/* onClick={(e, value) => {
                  results.splice(index, 1);
                  onChange(e.target.innerText);
                }} */}
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
                  onClick={(e) => e.stopPropagation()}
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
                    <Button color="twitter" size="small" compact={true}>
                      Preview
                    </Button>
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
