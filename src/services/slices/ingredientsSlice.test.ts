import { RequestState } from '@utils-types';
import {
  ingredientsSlice,
  initialState,
  getIngredients
} from './ingredientsSlice';

describe('ingredientsSlice', () => {
  const testIngredients = [
    {
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
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    }
  ];

  const createState = (overrides = {}) => ({
    ...initialState,
    ...overrides
  });

  test('устанавливается статус Loading при запросе getIngredients', () => {
    const actualState = ingredientsSlice.reducer(
      createState(),
      getIngredients.pending('')
    );

    expect(actualState).toEqual(
      createState({
        status: RequestState.Loading
      })
    );
  });

  test('при ошибке устанавливается статус Failed', () => {
    const testError = new Error('error message');
    const actualState = ingredientsSlice.reducer(
      createState({ status: RequestState.Loading }),
      getIngredients.rejected(testError, '')
    );

    expect(actualState).toEqual(
      createState({
        status: RequestState.Failed
      })
    );
  });

  test('в стейт добавляется массив ингредиентов, устанавливается статус Success', () => {
    const actualState = ingredientsSlice.reducer(
      createState({ status: RequestState.Loading }),
      getIngredients.fulfilled(testIngredients, '')
    );

    expect(actualState).toEqual(
      createState({
        data: testIngredients,
        status: RequestState.Success
      })
    );
  });
});
