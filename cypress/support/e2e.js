// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
// Alternatively you can use CommonJS syntax:
// require('./commands')

//Generate code-coverage
import '@cypress/code-coverage/support';

const API_PATH = () => Cypress.env('API_PATH') || 'http://localhost:8080/Plone';
const ADMIN_AUTH = { user: 'admin', pass: 'admin' };
const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const geolocationApiUrl = API_PATH;

export const enableDocumentCoreMetadataBehavior = () => {
  cy.autologin();
  return cy.request({
    method: 'PATCH',
    url: `${API_PATH()}/@controlpanels/dexterity-types/Document`,
    headers: JSON_HEADERS,
    auth: ADMIN_AUTH,
    body: { 'eea.coremetadata.behavior': true },
  });
};

export const cleanupContentTree = (rootPath = 'cypress') => {
  cy.autologin();
  return cy.request({
    method: 'DELETE',
    url: `${API_PATH()}/${rootPath}`,
    headers: { Accept: 'application/json' },
    auth: ADMIN_AUTH,
    body: {},
    failOnStatusCode: false,
  });
};

export const setupGeolocationPage = ({
  rootId = 'cypress',
  pageId = 'my-page',
  pageTitle = 'My Page',
} = {}) => {
  enableDocumentCoreMetadataBehavior();
  cleanupContentTree(rootId);
  cy.createContent({
    contentType: 'Document',
    contentId: rootId,
    contentTitle: 'Cypress',
  });
  cy.createContent({
    contentType: 'Document',
    contentId: pageId,
    contentTitle: pageTitle,
    path: rootId,
  });
  cy.visit(`/${rootId}/${pageId}/edit`);
  cy.waitForResourceToLoad(pageId);
  cy.url({ timeout: 15000 }).should('include', `/${rootId}/${pageId}/edit`);
  cy.get('.sidebar-container', { timeout: 15000 }).should('exist');
  cy.get('.sidebar-container').within(() => {
    cy.contains('a, button', /^Page$/).click({ force: true });
  });
  cy.get('.geo-field-wrapper', { timeout: 15000 }).should('exist');
};

export const geolocationFieldRow = (label) =>
  cy.contains('.geo-field-wrapper label', label).closest('.row');

export const geolocationSelectForLabel = (label) =>
  geolocationFieldRow(label).should('exist').find('.react-select-container').first();

export const openGeolocationSelect = (label) =>
  geolocationSelectForLabel(label)
    .scrollIntoView()
    .find('.react-select__control')
    .click({ force: true })
    .then(() => {
      cy.get('.react-select__menu', { timeout: 10000 }).should('exist');
    });

export const selectFirstReactOption = () =>
  cy
    .get('.react-select__menu .react-select__option', { timeout: 10000 })
    .first()
    .then(($option) => {
      const label = $option.text().trim();
      return cy.wrap($option).click({ force: true }).then(() => label);
    });

export const selectReactOptionByLabel = (label) =>
  cy
    .get('.react-select__menu .react-select__option', { timeout: 10000 })
    .contains(label)
    .click({ force: true });

export const fetchContent = (path) => {
  cy.autologin();
  return cy.request({
    method: 'GET',
    url: `${API_PATH()}/${path}`,
    headers: { Accept: 'application/json' },
    auth: ADMIN_AUTH,
  });
};

export const slateBeforeEach = (contentType = 'Document') => {
  cy.autologin();
  cy.createContent({
    contentType: 'Document',
    contentId: 'cypress',
    contentTitle: 'Cypress',
  });
  cy.createContent({
    contentType: contentType,
    contentId: 'my-page',
    contentTitle: 'My Page',
    path: 'cypress',
  });
  cy.visit('/cypress/my-page');
  cy.waitForResourceToLoad('my-page');
  cy.navigate('/cypress/my-page/edit');
};

export const slateAfterEach = () => {
  cy.autologin();
  cy.removeContent('cypress');
};

export const slateJsonBeforeEach = (contentType = 'slate') => {
  cy.autologin();
  cy.addContentType(contentType);
  cy.addSlateJSONField(contentType, 'slate');
  slateBeforeEach(contentType);
};

export const slateJsonAfterEach = (contentType = 'slate') => {
  cy.autologin();
  cy.removeContentType(contentType);
  slateAfterEach();
};

export const getSelectedSlateEditor = () => {
  return cy.get('.slate-editor.selected [contenteditable=true]').click();
};

export const createSlateBlock = () => {
  cy.get('.ui.basic.icon.button.block-add-button').first().click();
  cy.get('.blocks-chooser .title').contains('Text').click();
  cy.get('.ui.basic.icon.button.slate').contains('Text').click();
  return getSelectedSlateEditor();
};

export const getSlateBlockValue = (sb) => {
  return sb.invoke('attr', 'data-slate-value').then((str) => {
    return typeof str === 'undefined' ? [] : JSON.parse(str);
  });
};

export const createSlateBlockWithList = ({
  numbered,
  firstItemText,
  secondItemText,
}) => {
  let s1 = createSlateBlock();

  s1.typeInSlate(firstItemText + secondItemText);

  // select all contents of slate block
  // - this opens hovering toolbar
  cy.contains(firstItemText + secondItemText).then((el) => {
    selectSlateNodeOfWord(el);
  });

  // TODO: do not hardcode these selectors:
  if (numbered) {
    // this is the numbered list option in the hovering toolbar
    cy.get('.slate-inline-toolbar > :nth-child(9)').click();
  } else {
    // this is the bulleted list option in the hovering toolbar
    cy.get('.slate-inline-toolbar > :nth-child(10)').click();
  }

  // move the text cursor
  const sse = getSelectedSlateEditor();
  sse.type('{leftarrow}');
  for (let i = 0; i < firstItemText.length; ++i) {
    sse.type('{rightarrow}');
  }

  // simulate pressing Enter
  getSelectedSlateEditor().lineBreakInSlate();

  return s1;
};

export const selectSlateNodeOfWord = (el) => {
  return cy.window().then((win) => {
    var event = new CustomEvent('Test_SelectWord', {
      detail: el[0],
    });
    win.document.dispatchEvent(event);
  });
};
