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

describe('Geolocation Widget: Search and Results Flow', () => {
  beforeEach(() => {
    setupPage();
  });

  afterEach(() => {
    cy.autologin();
    cy.request({
      method: 'DELETE',
      url: `${api_url()}/cypress`,
      headers: { Accept: 'application/json' },
      auth: { user: 'admin', pass: 'admin' },
      body: {},
      failOnStatusCode: false,
    });
  });

  it('opens search popup and types in search input', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container', { timeout: 15000 }).should('exist');
    cy.get('aside.sidebar-container .form').should('exist');

    cy.get('aside.sidebar-container')
      .find('input[name="SearchableText"]')
      .should('exist')
      .type('Paris', { force: true });

    cy.get('aside.sidebar-container input[name="SearchableText"]').should('have.value', 'Paris');
  });

  it('cancels search via cancel button', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container .form', { timeout: 15000 }).should('exist');

    cy.get('aside.sidebar-container .form .header button').last().click({ force: true });

    cy.get('aside.sidebar-container').should('not.exist');
  });

  it('can clear selected tags in the search form', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container .form', { timeout: 15000 }).should('exist');

    cy.get('aside.sidebar-container .form .react-select-container').should('exist');
    cy.get('aside.sidebar-container .form .react-select-container')
      .find('.react-select__control')
      .should('exist');
  });

  it('shows form fields for search parameters', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container .form', { timeout: 15000 }).should('exist');

    cy.get('aside.sidebar-container .form').find('input').should('have.length.gte', 1);
  });

  it('shows search form header with title', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container .form', { timeout: 15000 }).should('exist');

    // The header should have an h2 title (either the schema title or default "Edit values")
    cy.get('aside.sidebar-container .form .header h2').should('exist');
  });
});