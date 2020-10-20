import React from 'react';
import {
  List,
  Segment,
  Header,
  Dimmer,
  Loader,
  Accordion,
  Label,
  Image,
  Card,
  Button,
} from 'semantic-ui-react';
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
      <ul>
        {results?.map((item, index) => (
          <li key={`result-${item.label}-${index}`}>
            <div className="li-item">
              <Image avatar src={''} />
              {item.label ? <Label horizontal>hello</Label> : null}

              <button className="list-button-md">
                {item.citationTitle || null}
              </button>
            </div>
            {activeAccIndex === index ? (
              <Card fluid>
                <Card.Content>
                  <Card.Description>
                    Hello
                    <Button
                      circular
                      color="twitter"
                      size="mini"
                      floated="right"
                    >
                      preview
                    </Button>
                  </Card.Description>
                  <Card.Meta>
                    <span className="result-type-orange">publication</span>
                    <span className="result-type"> . </span>
                    <span className="result-type">hello</span>
                  </Card.Meta>
                  <Card.Meta>
                    <span>hello</span>
                  </Card.Meta>
                  <Card.Description>
                    <a target="_blank" rel="noreferrer">
                      DOI:
                    </a>
                  </Card.Description>
                  <Card.Description>ISBN: </Card.Description>
                  <Card.Description>Publisher:</Card.Description>
                </Card.Content>
              </Card>
            ) : null}
          </li>
        ))}
      </ul>
    </Segment>
  );
};
export default ListResults;
