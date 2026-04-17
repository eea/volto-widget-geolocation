import {
  cleanupContentTree,
  geolocationSelectForLabel,
  openGeolocationSelect,
  selectFirstReactOption,
  setupGeolocationPage,
} from '../support/e2e';

describe('Geolocation Widget: Edit Mode', () => {
  beforeEach(() => {
    setupGeolocationPage();
  });

  afterEach(() => {
    cleanupContentTree();
  });

  it('displays the geographic group selector and coverage selector', () => {
    cy.get('.sidebar-container').should('exist');
    geolocationSelectForLabel('Geographic group').should('exist');
    geolocationSelectForLabel('Geographic coverage').should('exist');
  });

  it('selects a geographic group from the dropdown', () => {
    openGeolocationSelect('Geographic group');

    selectFirstReactOption().then((selectedGroup) => {
      geolocationSelectForLabel('Geographic group')
        .find('.react-select__single-value')
        .should('contain', selectedGroup);
    });
  });

  it('opens coverage dropdown and shows option groups', () => {
    openGeolocationSelect('Geographic coverage');

    cy.get('.react-select__menu', { timeout: 10000 }).should('exist');
    cy.get('.react-select__group-heading').should('exist');
  });

  it('selects and removes coverage items', () => {
    openGeolocationSelect('Geographic coverage');

    selectFirstReactOption().then((selectedCoverage) => {
      geolocationSelectForLabel('Geographic coverage')
        .find('.react-select__multi-value')
        .should('contain', selectedCoverage);
    });

    geolocationSelectForLabel('Geographic coverage')
      .find('.react-select__multi-value__remove')
      .first()
      .click({ force: true });

    geolocationSelectForLabel('Geographic coverage')
      .find('.react-select__multi-value')
      .should('not.exist');
  });

  it('clears the geographic group selection', () => {
    openGeolocationSelect('Geographic group');

    selectFirstReactOption().then((selectedGroup) => {
      geolocationSelectForLabel('Geographic group')
        .find('.react-select__single-value')
        .should('contain', selectedGroup);
    });

    geolocationSelectForLabel('Geographic group')
      .find('.react-select__clear-indicator')
      .click({ force: true });

    geolocationSelectForLabel('Geographic group')
      .find('.react-select__single-value')
      .should('not.exist');
  });

  it('opens the advanced search popup', () => {
    cy.get('.advanced-search-button').scrollIntoView().click({ force: true });
    cy.get('aside.sidebar-container', { timeout: 15000 }).should('exist');
    cy.get('aside.sidebar-container .form').should('exist');
  });
});
