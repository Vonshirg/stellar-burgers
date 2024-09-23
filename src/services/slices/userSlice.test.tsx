import { RequestState, TUserState } from '@utils-types';
import {
  userSlice,
  initialState,
  getUser,
  login,
  logout,
  register,
  updateUser
} from './userSlice';

describe('userSlice', () => {
  const registerTestData = {
    email: 'Jhon@mail.ru',
    name: 'Jhon',
    password: 'Jhon'
  };

  const loginTestData = {
    email: 'Jhon@mail.ru',
    password: 'Jhon'
  };

  const testUser = {
    email: 'Jhon@test.com',
    name: 'Jhon User'
  };

  const testError = new Error('Error');

  // Тесты для register
  test('устанавливается статус Loading при запросе register', () => {
    const actualState = userSlice.reducer(
      initialState,
      register.pending('', registerTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Loading
    });
  });

  test('при успешной регистрации устанавливается статус Success и добавляется пользователь', () => {
    const actualState = userSlice.reducer(
      initialState,
      register.fulfilled(testUser, '', registerTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      user: testUser,
      RequestState: RequestState.Success,
      isAuthChecked: true
    });
  });

  test('при ошибке регистрации устанавливается статус Failed и записывается ошибка', () => {
    const actualState = userSlice.reducer(
      initialState,
      register.rejected(testError, '', registerTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Failed,
      error: 'Error'
    });
  });

  // Тесты для login
  test('устанавливается статус Loading при запросе login', () => {
    const actualState = userSlice.reducer(
      initialState,
      login.pending('', loginTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Loading
    });
  });

  test('при успешном логине устанавливается статус Success и добавляется пользователь', () => {
    const actualState = userSlice.reducer(
      initialState,
      login.fulfilled(testUser, '', loginTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      user: testUser,
      RequestState: RequestState.Success,
      isAuthChecked: true
    });
  });

  test('при ошибке логина устанавливается статус Failed и записывается ошибка', () => {
    const actualState = userSlice.reducer(
      initialState,
      login.rejected(testError, '', loginTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Failed,
      error: 'Error'
    });
  });

  // Тесты для getUser
  test('устанавливается статус Loading при запросе getUser', () => {
    const actualState = userSlice.reducer(initialState, getUser.pending(''));

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Loading
    });
  });

  test('при успешном запросе getUser устанавливается статус Success и добавляется пользователь', () => {
    const actualState = userSlice.reducer(
      initialState,
      getUser.fulfilled(testUser, '')
    );

    expect(actualState).toEqual({
      ...initialState,
      user: testUser,
      RequestState: RequestState.Success,
      isAuthChecked: true
    });
  });

  test('при ошибке запроса getUser устанавливается статус Failed', () => {
    const actualState = userSlice.reducer(
      initialState,
      getUser.rejected(testError, '')
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Failed,
      error: 'Error'
    });
  });

  // Тесты для updateUser
  test('устанавливается статус Loading при запросе updateUser', () => {
    const actualState = userSlice.reducer(
      initialState,
      updateUser.pending('', registerTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Loading
    });
  });

  test('при успешном обновлении пользователя устанавливается статус Success и обновляются данные пользователя', () => {
    const actualState = userSlice.reducer(
      initialState,
      updateUser.fulfilled(testUser, '', registerTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      user: testUser,
      RequestState: RequestState.Success,
      isAuthChecked: true
    });
  });

  test('при ошибке обновления пользователя устанавливается статус Failed и записывается ошибка', () => {
    const actualState = userSlice.reducer(
      initialState,
      updateUser.rejected(testError, '', registerTestData)
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Failed,
      error: 'Error'
    });
  });

  // Тесты для logout
  test('устанавливается статус Loading при запросе logout', () => {
    const actualState = userSlice.reducer(initialState, logout.pending(''));

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Loading
    });
  });

  test('при успешном логауте очищаются данные пользователя и статус меняется на Success', () => {
    const stateWithUser = {
      ...initialState,
      user: testUser,
      isAuthChecked: true,
      RequestState: RequestState.Success
    };

    const actualState = userSlice.reducer(
      stateWithUser,
      logout.fulfilled(undefined, '')
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Success,
      isAuthChecked: false
    });
  });

  test('при ошибке логаута устанавливается статус Failed и записывается ошибка', () => {
    const actualState = userSlice.reducer(
      initialState,
      logout.rejected(testError, '')
    );

    expect(actualState).toEqual({
      ...initialState,
      RequestState: RequestState.Failed,
      error: 'Error'
    });
  });
});
