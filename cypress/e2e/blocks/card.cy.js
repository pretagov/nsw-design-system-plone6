beforeEach(() => {
  // given a logged in editor and the site root
  cy.autologin();
  cy.visit('/');
  cy.waitForResourceToLoad('@navigation');
  cy.waitForResourceToLoad('@breadcrumbs');
  cy.waitForResourceToLoad('@actions');
  cy.waitForResourceToLoad('@types');
});
describe('Adding a card block', () => {
  it('As an editor I can add a card block.', function () {
    // Create a new page
    cy.findByLabelText('Add').click();
    cy.findByText('Page', { selector: 'li a' }).click();

    // Add the required title
    cy.get('input[name="title"]').type('Card test');

    // Add the card
    cy.getSlate().click();
    cy.get('button.block-add-button').click();
    // I don't like this wait, but the add button is being unmounted
    cy.get('.blocks-chooser .title').contains('NSW').click().wait(400);
    cy.get('.blocks-chooser .nsw')
      .contains('Card')
      .should('be.visible')
      .click();

    // Check the card is on the page
    cy.get('.nsw-card').should('be.visible');
  });
});
describe('Configuring a card block', () => {});
