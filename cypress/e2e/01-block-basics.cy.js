import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Geo Widget Test', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Set Behaviour', () => {
    // Go to Control Panel
    cy.visit('/controlpanel/dexterity-types/Document');
    cy.contains('Behaviors').click();
    cy.contains('EEA Core metadata').click();
    cy.get('#toolbar-save').click();
    cy.get('.logo').click();
  });

  it('Add Page: Empty', () => {
    // Change page title
    cy.get('[contenteditable=true]').first().clear();

    cy.get('[contenteditable=true]').first().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.get('[contenteditable=true]').first().type('{enter}');
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');
  });
});
