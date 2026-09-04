import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const api_url = () => Cypress.env('API_PATH') || 'http://localhost:8080/Plone';

describe('Geolocation Widget: View Mode', () => {
  beforeEach(() => {
    cy.autologin();
    cy.request({
      method: 'PATCH',
      url: `${api_url()}/@controlpanels/dexterity-types/Document`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      auth: { user: 'admin', pass: 'admin' },
      body: { 'eea.coremetadata.behavior': true },
    });
  });

  it('renders read-only geolocation in edit form when readOnly is set', () => {
    // Create a document with readOnly geo_coverage
    cy.createContent({
      contentType: 'Document',
      contentId: 'cypress',
      contentTitle: 'Cypress',
    });
    cy.request({
      method: 'POST',
      url: `${api_url()}/cypress/`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      auth: { user: 'admin', pass: 'admin' },
      body: {
        '@type': 'Document',
        id: 'readonly-test',
        title: 'Read Only Test',
        geo_coverage: {
          readOnly: true,
          geolocation: [
            { label: 'Austria', value: 'geo-2782113' },
            { label: 'Alpine', value: 'alpine' },
          ],
        },
      },
    });

    // Navigate to edit - the geolocation widget should render in read-only mode
    cy.visit('/cypress/readonly-test');
    cy.waitForResourceToLoad('readonly-test');
    cy.navigate('/cypress/readonly-test/edit');

    // The read-only view widget should show geolocation items
    cy.get('ul.geolocation-widget.read-only', { timeout: 15000 }).should('exist');
    cy.get('ul.geolocation-widget.read-only li').should('have.length', 2);
    cy.get('ul.geolocation-widget.read-only li').first().should('contain', 'Austria');
    cy.get('ul.geolocation-widget.read-only li').last().should('contain', 'Alpine');

    // Clean up
    cy.autologin();
    cy.removeContent('cypress');
  });

  it('renders geolocation items with correct labels in read-only mode', () => {
    cy.createContent({
      contentType: 'Document',
      contentId: 'cypress',
      contentTitle: 'Cypress',
    });
    cy.request({
      method: 'POST',
      url: `${api_url()}/cypress/`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      auth: { user: 'admin', pass: 'admin' },
      body: {
        '@type': 'Document',
        id: 'readonly-labels-test',
        title: 'Read Only Labels Test',
        geo_coverage: {
          readOnly: true,
          geolocation: [
            { label: 'Romania', value: 'geo-798549' },
          ],
        },
      },
    });

    cy.visit('/cypress/readonly-labels-test');
    cy.waitForResourceToLoad('readonly-labels-test');
    cy.navigate('/cypress/readonly-labels-test/edit');

    cy.get('ul.geolocation-widget.read-only li', { timeout: 15000 }).should('contain', 'Romania');

    // Clean up
    cy.autologin();
    cy.removeContent('cypress');
  });

  it('does not show edit controls when readOnly is set', () => {
    cy.createContent({
      contentType: 'Document',
      contentId: 'cypress',
      contentTitle: 'Cypress',
    });
    cy.request({
      method: 'POST',
      url: `${api_url()}/cypress/`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      auth: { user: 'admin', pass: 'admin' },
      body: {
        '@type': 'Document',
        id: 'readonly-nocontrols-test',
        title: 'Read Only Controls Test',
        geo_coverage: {
          readOnly: true,
          geolocation: [
            { label: 'Alpine', value: 'alpine' },
          ],
        },
      },
    });

    cy.visit('/cypress/readonly-nocontrols-test');
    cy.waitForResourceToLoad('readonly-nocontrols-test');
    cy.navigate('/cypress/readonly-nocontrols-test/edit');

    // In read-only mode, the group selector and coverage selector should not be shown
    // Instead, the GeolocationWidgetView should be rendered
    cy.get('ul.geolocation-widget.read-only', { timeout: 15000 }).should('exist');

    // The geographic group select should NOT be shown (only the readonly view)
    cy.get('.geo-field-wrapper .react-select-container').should('not.exist');

    // The advanced search button should NOT be shown
    cy.get('.advanced-search-button').should('not.exist');

    // Clean up
    cy.autologin();
    cy.removeContent('cypress');
  });
});