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

describe('Geolocation Widget: Edit Mode', () => {
  beforeEach(() => {
    setupPage();
  });

  afterEach(() => {
    cy.autologin();
    cy.removeContent('cypress');
  });

  it('displays the geographic group selector and coverage selector', () => {
    cy.get('.sidebar-container').should('exist');
    cy.get('.geo-field-wrapper').should('exist');
    cy.get('.geo-field-wrapper .react-select-container').should(
      'have.length.gte',
      2,
    );
  });

  it('selects a geographic group from the dropdown', () => {
    const groupSelect = cy
      .get('.geo-field-wrapper')
      .find('.react-select-container')
      .first()
      .find('.react-select__control');

    groupSelect.click({ force: true });
    groupSelect.find('input').type('{downarrow}{enter}', { force: true });

    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .first()
      .find('.react-select__single-value')
      .should('exist');
  });

  it('opens coverage dropdown and shows option groups', () => {
    const coverageSelect = cy
      .get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__control');

    coverageSelect.click({ force: true });
    cy.contains('Biogeographical regions').should('exist');
  });

  it('selects and removes coverage items', () => {
    // Open coverage dropdown and select Alpine
    const coverageSelect = cy
      .get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__control');

    coverageSelect.click({ force: true });
    coverageSelect.find('input').type('Alpine{enter}', { force: true });

    // Verify selected
    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__multi-value')
      .should('contain', 'Alpine');

    // Wait a bit for the UI to settle
    cy.wait(500);

    // Remove the selected item
    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__multi-value__remove')
      .first()
      .click({ force: true });

    // Verify removal
    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .eq(1)
      .find('.react-select__multi-value')
      .should('not.exist');
  });

  it('clears the geographic group selection', () => {
    // First select a group
    const groupSelect = cy
      .get('.geo-field-wrapper')
      .find('.react-select-container')
      .first()
      .find('.react-select__control');

    groupSelect.click({ force: true });
    groupSelect.find('input').type('{downarrow}{enter}', { force: true });

    // Wait for selection to settle
    cy.wait(500);

    // Now clear it
    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .first()
      .find('.react-select__clear-indicator')
      .click({ force: true });

    // Verify cleared
    cy.get('.geo-field-wrapper')
      .find('.react-select-container')
      .first()
      .find('.react-select__single-value')
      .should('not.exist');
  });

  it('opens the advanced search popup', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container', { timeout: 15000 }).should('exist');
    cy.get('aside.sidebar-container .form').should('exist');
  });
});
