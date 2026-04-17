import { cleanupContentTree, setupGeolocationPage } from '../support/e2e';

describe('Geolocation Widget: Search GeoName', () => {
  beforeEach(() => {
    setupGeolocationPage();
  });

  afterEach(() => {
    cleanupContentTree();
  });

  const openSearchPopup = () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container .form', { timeout: 15000 }).should('exist');
  };

  it('opens the search popup and shows the search form', () => {
    openSearchPopup();
    cy.get('aside.sidebar-container').should('exist');
  });

  it('shows header action buttons in the search popup', () => {
    openSearchPopup();
    cy.get('aside.sidebar-container .form .header button').should('have.length.gte', 2);
  });

  it('shows the select field for selected tags in the search form', () => {
    openSearchPopup();
    cy.get('aside.sidebar-container .form .react-select-container').should('exist');
  });

  it('shows form fields in the inline form', () => {
    openSearchPopup();
    cy.get('aside.sidebar-container .form')
      .find('input, select, .react-select-container')
      .should('have.length.gte', 1);
  });

  it('closes the popup with the close button', () => {
    openSearchPopup();

    cy.get('aside.sidebar-container .form .header button').last().click({ force: true });

    cy.get('aside.sidebar-container').should('not.exist');
  });
});
