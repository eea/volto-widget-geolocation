import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const api_url = () => Cypress.env('API_PATH') || 'http://localhost:8080/Plone';

const enableEeaCoreMetadata = () => {
  cy.autologin();
  cy.request({
    method: 'PATCH',
    url: `${api_url()}/@controlpanels/dexterity-types/Document`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    auth: { user: 'admin', pass: 'admin' },
    body: { 'eea.coremetadata.behavior': true },
  });
};

const setupPage = () => {
  enableEeaCoreMetadata();
  cy.autologin();
  cy.createContent({
    contentType: 'Document',
    contentId: 'cypress',
    contentTitle: 'Cypress',
  });
  cy.createContent({
    contentType: 'Document',
    contentId: 'my-page',
    contentTitle: 'My Page',
    path: 'cypress',
  });
  cy.visit('/cypress/my-page');
  cy.waitForResourceToLoad('my-page');
  cy.navigate('/cypress/my-page/edit');
};

describe('Geolocation Widget: Search GeoName', () => {
  beforeEach(() => {
    setupPage();
  });

  afterEach(() => {
    cy.autologin();
    cy.removeContent('cypress');
  });

  it('opens the search popup and shows the search form', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container', { timeout: 15000 }).should('exist');
    cy.get('aside.sidebar-container .form').should('exist');
  });

  it('shows header action buttons in the search popup', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container .form', { timeout: 15000 }).should('exist');
    cy.get('aside.sidebar-container .form .header button').should('have.length.gte', 2);
  });

  it('shows the select field for selected tags in the search form', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container .form', { timeout: 15000 }).should('exist');
    cy.get('aside.sidebar-container .form .react-select-container').should('exist');
  });

  it('shows form fields in the inline form', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container .form', { timeout: 15000 }).should('exist');
    cy.get('aside.sidebar-container .form').find('input, select, .react-select-container').should('have.length.gte', 1);
  });

  it('closes the popup with the close button', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container', { timeout: 15000 }).should('exist');
    cy.get('aside.sidebar-container .form').should('exist');

    // Click the last header button (the close/cancel button with clear icon)
    cy.get('aside.sidebar-container .form .header button').last().click({ force: true });

    // The popup should be closed
    cy.get('aside.sidebar-container').should('not.exist');
  });
});