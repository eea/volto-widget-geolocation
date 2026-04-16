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

describe('Geolocation Widget: Group Selection and Coverage Flow', () => {
  beforeEach(() => {
    setupPage();
  });

  afterEach(() => {
    cy.autologin();
    cy.removeContent('cypress');
  });

  it('selects a geographic group and updates coverage', () => {
    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .first()
      .find('.react-select__control')
      .click({ force: true });

    cy.get('.react-select__menu', { timeout: 10000 }).should('exist');

    cy.get('.react-select__menu .react-select__option')
      .first()
      .click({ force: true });

    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .first()
      .find('.react-select__single-value')
      .should('exist');
  });

  it('saves document with geolocation data', () => {
    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__control')
      .click({ force: true });

    cy.get('.react-select__menu', { timeout: 10000 }).should('exist');

    cy.get('.react-select__menu .react-select__option')
      .contains('Alpine')
      .click({ force: true });

    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__multi-value')
      .should('contain', 'Alpine');

    cy.get('#toolbar-save').click();

    cy.visit('/cypress/my-page');
    cy.waitForResourceToLoad('my-page');
    cy.navigate('/cypress/my-page/edit');

    cy.get('.geo-field-wrapper').should('exist');
  });
});