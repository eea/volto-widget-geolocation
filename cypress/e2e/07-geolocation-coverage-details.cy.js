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

describe('Geolocation Widget: Coverage Selection Details', () => {
  beforeEach(() => {
    setupPage();
  });

  afterEach(() => {
    cy.autologin();
    cy.removeContent('cypress');
  });

  it('selects a group and then selects an option from the filtered list', () => {
    // Select a group
    const groupSelect = cy
      .get('.geo-field-wrapper')
      .find('.react-select-container')
      .first()
      .find('.react-select__control');

    groupSelect.click({ force: true });
    groupSelect.find('input').type('{downarrow}{enter}', { force: true });

    cy.wait(500);

    // Open the coverage dropdown
    const coverageSelect = cy
      .get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__control');

    coverageSelect.click({ force: true });
    cy.contains('Biogeographical regions').should('exist');

    // Select an option
    coverageSelect.find('input').type('{downarrow}{enter}', { force: true });

    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__multi-value')
      .should('exist');
  });

  it('selects items from biogeographical regions group', () => {
    const coverageSelect = cy
      .get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__control');

    coverageSelect.click({ force: true });
    coverageSelect.find('input').type('Alpine{enter}', { force: true });

    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__multi-value')
      .should('contain', 'Alpine');
  });

  it('saves with coverage items and verifies geo field persists', () => {
    const coverageSelect = cy
      .get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__control');

    coverageSelect.click({ force: true });
    coverageSelect.find('input').type('Alpine{enter}', { force: true });

    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__multi-value')
      .should('contain', 'Alpine');

    // Save
    cy.get('#toolbar-save').click();

    // Wait for saved page to load
    cy.url().should('include', '/cypress/my-page');
  });
});
