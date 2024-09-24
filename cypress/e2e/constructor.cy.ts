// Добавляем команду для проверки модального окна ингредиента
Cypress.Commands.add('checkIngredients', () => {
  cy.contains('Детали ингредиента');
});

// Константы для часто используемых селекторов
const VIEWPORT = { width: 1300, height: 800 };
const API_INGREDIENTS = 'api/ingredients';
const DATA_CY_INGREDIENTS = '[data-cy=ingredients]';
const BUN_SELECTOR_1 = '[data-cy=constructor-bun-1]';
const BUN_SELECTOR_2 = '[data-cy=constructor-bun-2]';
const DATA_CY_CONSTRUCTOR = '[data-cy=constructor]';

// Функция для настройки начального состояния перед тестом
const setupTest = () => {
  cy.intercept('GET', API_INGREDIENTS, { fixture: 'ingredients.json' });
  cy.viewport(VIEWPORT.width, VIEWPORT.height);
  cy.visit('/');
};

describe('ингредиент добавляется в конструктор корректно', function () {
  it('должен добавляться ингредиент булка', function () {
    setupTest();
    cy.get(BUN_SELECTOR_1).should('not.exist');
    cy.get(BUN_SELECTOR_2).should('not.exist');

    cy.get(DATA_CY_INGREDIENTS).contains('Добавить').click();
    cy.get(BUN_SELECTOR_1).contains('ингредиент 1').should('exist');
    cy.get(BUN_SELECTOR_2).contains('ингредиент 1').should('exist');
  });
});

describe('открытие и закрытие модального окна ингредиента', function () {
  beforeEach(setupTest);

  it('открывается модальное окно ингредиента', function () {
    cy.checkIngredients().should('not.exist');

    cy.contains('ингредиент 2').click();
    cy.checkIngredients().should('exist');
  });

  it('модальное окно закрывается по крестику', function () {
    cy.checkIngredients().should('not.exist');

    cy.contains('ингредиент 1').click();
    cy.checkIngredients().should('exist');

    cy.get('[data-cy=close-button]').click();

    cy.checkIngredients().should('not.exist');
  });

  it('модальное окно закрывается по оверлэю', function () {
    cy.checkIngredients().should('not.exist');

    cy.contains('ингредиент 1').click();
    cy.checkIngredients().should('exist');

    cy.get('[data-cy=overlay]').click('left', { force: true });

    cy.checkIngredients().should('not.exist');
  });
});

describe('заказ создается корректно', function () {
  beforeEach(function () {
    cy.intercept('GET', API_INGREDIENTS, { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');
    setupTest();
    window.localStorage.setItem('refreshToken', JSON.stringify('refreshTokenTest'));
    cy.setCookie('accessToken', 'accessTokenTest');
  });

  it('открывается модальное окно после оформления заказа, после закрытия очищается конструктор', function () {
    cy.get('[data-cy=order-number]').should('not.exist');

    cy.get(DATA_CY_INGREDIENTS).contains('Добавить').click();
    cy.contains('Оформить заказ').click();


    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', { ingredients: ['1', '1'] });

    cy.get('[data-cy=order-number]').contains('777777').should('exist');

    cy.get('[data-cy=close-button]').click();
    cy.get('[data-cy=order-number]').should('not.exist');
    cy.get(DATA_CY_CONSTRUCTOR).contains('Выберите булки').should('exist');
    cy.get(DATA_CY_CONSTRUCTOR).contains('Выберите начинку').should('exist');
  });
});

describe('проверка авторизации', function () {
  it('открывается форма авторизации, заполняется, проходит успешно', function () {
    setupTest();
    cy.intercept('POST', 'api/auth/login', { fixture: 'login.json' }).as('postLogin');

    cy.get('[data-cy=profile-link]').click();
    cy.get('form input[type=email]').type('test@mail.com');
    cy.get('form input[type=password]').type('12345678');
    cy.get('form button').click();
    cy.wait('@postLogin')
      .its('request.body')
      .should('deep.equal', {
        email: 'test@mail.com',
        password: '12345678'
      });

    cy.get('[data-cy=mainpage-link]').click();
  });
});
