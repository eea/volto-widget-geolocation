import {
  cleanupContentTree,
  fetchContent,
  geolocationSelectForLabel,
  openGeolocationSelect,
  selectFirstReactOption,
  setupGeolocationPage,
} from '../support/e2e';

describe('Geolocation Widget: Group Selection and Coverage Flow', () => {
  beforeEach(() => {
    setupGeolocationPage();
  });

  afterEach(() => {
    cleanupContentTree();
  });

  it('selects a geographic group and updates coverage options', () => {
    openGeolocationSelect('Geographic group');

    selectFirstReactOption().then((selectedGroup) => {
      geolocationSelectForLabel('Geographic group')
        .find('.react-select__single-value')
        .should('contain', selectedGroup);
    });

    openGeolocationSelect('Geographic coverage');
    cy.get('.react-select__menu .react-select__option', { timeout: 10000 }).should(
      'have.length.gte',
      1,
    );
  });

  it('saves document with geolocation data and persists selected values', () => {
    openGeolocationSelect('Geographic group');
    selectFirstReactOption().as('selectedGroupLabel');

    openGeolocationSelect('Geographic coverage');
    selectFirstReactOption().as('selectedCoverageLabel');

    cy.toolbarSave();

    cy.get('@selectedGroupLabel').then((selectedGroupLabel) => {
      cy.get('@selectedCoverageLabel').then((selectedCoverageLabel) => {
        fetchContent('cypress/my-page').its('body.geo_coverage').should((geoCoverage) => {
          expect(geoCoverage).to.be.an('object');
          expect(geoCoverage.selectedGroup.label).to.eq(selectedGroupLabel);
          expect(geoCoverage.geolocation).to.be.an('array').that.is.not.empty;
          expect(geoCoverage.geolocation.map((item) => item.label)).to.include(
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
});
