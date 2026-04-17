import {
  cleanupContentTree,
  enableDocumentCoreMetadataBehavior,
  geolocationApiUrl,
} from '../support/e2e';

const createReadOnlyDocument = ({ id, title, geolocation }) => {
  cy.createContent({
    contentType: 'Document',
    contentId: 'cypress',
    contentTitle: 'Cypress',
  });

  cy.request({
    method: 'POST',
    url: `${geolocationApiUrl()}/cypress/`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    auth: { user: 'admin', pass: 'admin' },
    body: {
      '@type': 'Document',
      id,
      title,
      geo_coverage: {
        readOnly: true,
        geolocation,
      },
    },
  });
};

const visitReadOnlyDocumentInEdit = (id) => {
  cy.autologin();
  cy.visit(`/cypress/${id}`);
  cy.waitForResourceToLoad(id);
  cy.navigate(`/cypress/${id}/edit`);
};

describe('Geolocation Widget: View Mode', () => {
  beforeEach(() => {
    enableDocumentCoreMetadataBehavior();
    cleanupContentTree();
  });

  afterEach(() => {
    cleanupContentTree();
  });

  it('renders read-only geolocation in edit form when readOnly is set', () => {
    createReadOnlyDocument({
      id: 'readonly-test',
      title: 'Read Only Test',
      geolocation: [
        { label: 'Austria', value: 'geo-2782113' },
        { label: 'Alpine', value: 'alpine' },
      ],
    });

    visitReadOnlyDocumentInEdit('readonly-test');

    cy.get('ul.geolocation-widget.read-only', { timeout: 15000 }).should('exist');
    cy.get('ul.geolocation-widget.read-only li').should('have.length', 2);
    cy.get('ul.geolocation-widget.read-only li').first().should('contain', 'Austria');
    cy.get('ul.geolocation-widget.read-only li').last().should('contain', 'Alpine');
  });

  it('renders geolocation items with correct labels in read-only mode', () => {
    createReadOnlyDocument({
      id: 'readonly-labels-test',
      title: 'Read Only Labels Test',
      geolocation: [{ label: 'Romania', value: 'geo-798549' }],
    });

    visitReadOnlyDocumentInEdit('readonly-labels-test');

    cy.get('ul.geolocation-widget.read-only li', { timeout: 15000 }).should(
      'contain',
      'Romania',
    );
  });

  it('does not show edit controls when readOnly is set', () => {
    createReadOnlyDocument({
      id: 'readonly-nocontrols-test',
      title: 'Read Only Controls Test',
      geolocation: [{ label: 'Alpine', value: 'alpine' }],
    });

    visitReadOnlyDocumentInEdit('readonly-nocontrols-test');

    cy.get('ul.geolocation-widget.read-only', { timeout: 15000 }).should('exist');
    cy.get('.geo-field-wrapper .react-select-container').should('not.exist');
    cy.get('.advanced-search-button').should('not.exist');
  });
});
