import { RequestState } from '@utils-types';
import { feedSlice, initialState, getFeed } from './feedSlice';

describe('feedSlice', () => {
  const testResponse = {
    success: true,
    orders: [
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
    ],
    total: 100,
    totalToday: 10
  };

  const createState = (overrides = {}) => ({
    ...initialState,
    ...overrides
  });

  test('при запросе getFeed устанавливается статус Loading', () => {
    const actualState = feedSlice.reducer(createState(), getFeed.pending(''));

    expect(actualState).toEqual(
      createState({
        status: RequestState.Loading
      })
    );
  });

  test('при ошибке устанавливается статус Failed', () => {
    const testError = new Error('error message');
    const actualState = feedSlice.reducer(
      createState({ status: RequestState.Loading }),
      getFeed.rejected(testError, '')
    );

    expect(actualState).toEqual(
      createState({
        status: RequestState.Failed
      })
    );
  });

  test('в стейт добавляется массив заказов, устанавливается статус Success', () => {
    const actualState = feedSlice.reducer(
      createState({ status: RequestState.Loading }),
      getFeed.fulfilled(testResponse, '')
    );

    expect(actualState).toEqual(
      createState({
        orders: testResponse.orders,
        total: testResponse.total,
        totalToday: testResponse.totalToday,
        status: RequestState.Success
      })
    );
  });
});
