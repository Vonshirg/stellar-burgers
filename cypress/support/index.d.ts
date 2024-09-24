declare namespace Cypress {
  interface Chainable<Subject = any> {
    checkIngredients(): Chainable<Subject>;
  }
}
