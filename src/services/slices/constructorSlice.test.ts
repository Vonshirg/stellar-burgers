import { RequestState } from '@utils-types';
import constructorReducer, {
  addToConstructor,
  removeFromConstructor,
  reorderConstructor,
  resetConstructor,
  resetOrder,
  makeOrder,
  getOrder,
  getOrders,
  initialState
} from './constructorSlice';

const baseIngredient = {
  _id: '1',
  name: 'ингредиент 1',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const testOrder = {
  _id: '1',
  ingredients: ['643d69a5c3f7b9001cfa093c'],
  status: 'done',
  name: 'name',
  createdAt: '2024-08-23T17:22:37.284Z',
  updatedAt: '2024-08-23T17:22:37.763Z',
  number: 50897
};

const createIngredient = (overrides = {}) => ({
  ...baseIngredient,
  ...overrides
});

const testIngredients = [
  createIngredient({ _id: '2', name: 'ингредиент 2', type: 'main' }),
  createIngredient({ _id: '3', name: 'ингредиент 3', type: 'main' })
];

describe('constructorSlice', () => {
  test('добавляется ингредиент', () => {
    const newState = constructorReducer(
      initialState,
      addToConstructor(baseIngredient)
    );

    expect(newState.bun).toEqual({
      ...baseIngredient,
      id: expect.any(String)
    });
  });

  test('удаляется ингредиент', () => {
    const actualState = {
      ...initialState,
      ingredients: testIngredients
    };

    const newState = constructorReducer(actualState, removeFromConstructor(1));

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]._id).toBe('2');
  });

  test('ингредиенты в конструкторе меняются местами', () => {
    const actualState = {
      ...initialState,
      ingredients: testIngredients
    };

    const newState = constructorReducer(
      actualState,
      reorderConstructor({ from: 0, to: 1 })
    );

    expect(newState.ingredients).toEqual([
      testIngredients[1],
      testIngredients[0]
    ]);
  });

  test('сбрасывается конструктор', () => {
    const actualState = {
      ...initialState,
      bun: baseIngredient,
      ingredients: testIngredients
    };

    const newState = constructorReducer(actualState, resetConstructor());

    expect(newState).toEqual(initialState);
  });

  test('устанавливается статус Loading при запросе makeOrder', () => {
    const actualState = constructorReducer(
      initialState,
      makeOrder.pending('', [''])
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Loading
    });
  });

  test('при успешном создании заказа устанавливается статус Success и добавляется новый заказ', () => {
    const actualState = constructorReducer(
      {
        ...initialState,
        RequestState: RequestState.Loading
      },
      makeOrder.fulfilled(
        { success: true, order: testOrder, name: 'name' },
        '',
        ['']
      )
    );

    expect(actualState).toEqual({
      ...initialState,
      order: testOrder,
      orders: [testOrder],
      RequestState: RequestState.Success
    });
  });

  test('при ошибке создания заказа устанавливается статус Failed', () => {
    const testError = new Error('error message');
    const actualState = constructorReducer(
      {
        ...initialState,
        RequestState: RequestState.Loading
      },
      makeOrder.rejected(testError, '', [''])
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Failed
    });
  });

  test('сбрасывается заказ', () => {
    const actualState = {
      ...initialState,
      order: testOrder,
      RequestState: RequestState.Success
    };

    const newState = constructorReducer(actualState, resetOrder());

    expect(newState).toEqual({
      ...initialState,
      order: null,
      RequestState: RequestState.Pending
    });
  });

  test('устанавливается статус Loading при запросе getOrders', () => {
    const actualState = constructorReducer(initialState, getOrders.pending(''));

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Loading
    });
  });

  test('при успешном запросе getOrders устанавливается статус Success и добавляются заказы', () => {
    const testOrders = [
      {
        _id: '1',
        ingredients: ['643d69a5c3f7b9001cfa093c'],
        status: 'done',
        name: 'Краторный люминесцентный бургер',
        createdAt: '2024-08-23T17:22:37.284Z',
        updatedAt: '2024-08-23T17:22:37.763Z',
        number: 50897
      },
      {
        _id: '2',
        ingredients: ['643d69a5c3f7b9001cfa093c'],
        status: 'done',
        name: 'Краторный люминесцентный метеоритный бургер',
        createdAt: '2024-08-23T17:13:54.100Z',
        updatedAt: '2024-08-23T17:13:54.587Z',
        number: 50896
      }
    ];

    const actualState = constructorReducer(
      {
        ...initialState,
        RequestState: RequestState.Loading
      },
      getOrders.fulfilled(testOrders, '')
    );

    expect(actualState).toEqual({
      ...initialState,
      orders: testOrders,
      RequestState: RequestState.Success
    });
  });

  test('при ошибке запроса getOrders устанавливается статус Failed', () => {
    const testError = new Error('error message');
    const actualState = constructorReducer(
      {
        ...initialState,
        RequestState: RequestState.Loading
      },
      getOrders.rejected(testError, '')
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Failed
    });
  });

  test('устанавливается статус Loading при запросе getOrder', () => {
    const actualState = constructorReducer(
      initialState,
      getOrder.pending('', 50897)
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Loading
    });
  });

  test('при успешном запросе getOrder устанавливается статус Success и добавляется заказ в state', () => {
    const actualState = constructorReducer(
      {
        ...initialState,
        RequestState: RequestState.Loading
      },
      getOrder.fulfilled({ success: true, orders: [testOrder] }, '', 50897)
    );

    expect(actualState).toEqual({
      ...initialState,
      order: testOrder,
      orders: [testOrder],
      RequestState: RequestState.Success
    });
  });

  test('при ошибке запроса getOrder устанавливается статус Failed', () => {
    const testError = new Error('error message');
    const actualState = constructorReducer(
      {
        ...initialState,
        RequestState: RequestState.Loading
      },
      getOrder.rejected(testError, '', 50897)
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Failed
    });
  });
});
