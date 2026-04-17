import {
  cleanupContentTree,
  fetchContent,
  geolocationSelectForLabel,
  openGeolocationSelect,
  selectFirstReactOption,
  setupGeolocationPage,
} from '../support/e2e';

describe('Geolocation Widget: Coverage Selection Details', () => {
  beforeEach(() => {
    setupGeolocationPage();
  });

  afterEach(() => {
    cleanupContentTree();
  });

  it('selects a group and then selects an option from the filtered list', () => {
    openGeolocationSelect('Geographic group');
    selectFirstReactOption().as('selectedGroupLabel');

    cy.get('@selectedGroupLabel').then((selectedGroupLabel) => {
      geolocationSelectForLabel('Geographic group')
        .find('.react-select__single-value')
        .should('contain', selectedGroupLabel);
    });

    openGeolocationSelect('Geographic coverage');
    selectFirstReactOption().then((selectedCoverageLabel) => {
      geolocationSelectForLabel('Geographic coverage')
        .find('.react-select__multi-value')
        .should('contain', selectedCoverageLabel);
    });
  });

  it('selects an item from coverage options', () => {
    openGeolocationSelect('Geographic coverage');

    selectFirstReactOption().then((selectedCoverageLabel) => {
      geolocationSelectForLabel('Geographic coverage')
        .find('.react-select__multi-value')
        .should('contain', selectedCoverageLabel);
    });
  });

  it('saves with coverage items and verifies persistence in backend payload', () => {
    openGeolocationSelect('Geographic coverage');
    selectFirstReactOption().as('selectedCoverageLabel');

    cy.toolbarSave();

    cy.get('@selectedCoverageLabel').then((selectedCoverageLabel) => {
      fetchContent('cypress/my-page').its('body.geo_coverage.geolocation').should((geolocation) => {
        expect(geolocation).to.be.an('array').that.is.not.empty;
        expect(geolocation.map((item) => item.label)).to.include(
          selectedCoverageLabel,
        );
      });

      cy.visit('/cypress/my-page/edit');
      cy.waitForResourceToLoad('my-page');
      geolocationSelectForLabel('Geographic coverage')
        .find('.react-select__multi-value')
        .should('contain', selectedCoverageLabel);
    });
  });
});
