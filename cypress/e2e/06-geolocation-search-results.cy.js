import { cleanupContentTree, setupGeolocationPage } from '../support/e2e';

describe('Geolocation Widget: Search and Results Flow', () => {
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

  it('opens search popup and types in search input', () => {
    openSearchPopup();

    cy.get('aside.sidebar-container')
      .find('input[name="SearchableText"]')
      .should('exist')
      .type('Paris', { force: true });

    cy.get('aside.sidebar-container input[name="SearchableText"]').should(
      'have.value',
      'Paris',
    );
  });

  it('cancels search via cancel button', () => {
    openSearchPopup();

    cy.get('aside.sidebar-container .form .header button').last().click({ force: true });

    cy.get('aside.sidebar-container').should('not.exist');
  });

  it('shows selected tags control in the search form', () => {
    openSearchPopup();

    cy.get('aside.sidebar-container .form .react-select-container')
      .find('.react-select__control')
      .should('exist');
  });

  it('shows form fields for search parameters', () => {
    openSearchPopup();

    cy.get('aside.sidebar-container .form')
      .find('input')
      .should('have.length.gte', 1);
  });

  it('shows search form header with title', () => {
    openSearchPopup();

    cy.get('aside.sidebar-container .form .header h2')
      .should('exist')
      .invoke('text')
      .should('not.be.empty');
  });
});
