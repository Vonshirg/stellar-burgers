import { combineReducers } from '@reduxjs/toolkit';
import { сonstructorSlice } from './slices/constructorSlice';
import { feedSlice } from './slices/feedSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';

describe('rootReducer', () => {
  const rootReducer = combineReducers({
    [ingredientsSlice.name]: ingredientsSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [feedSlice.name]: feedSlice.reducer,
    [сonstructorSlice.name]: сonstructorSlice.reducer
  });
  test('rootReducer корректно инициализируется с начальным состоянием при передаче значения undefined в стейт и обработке неизвестного действия', () => {
    const initialState = {
      [ingredientsSlice.name]: ingredientsSlice.getInitialState(),
      [userSlice.name]: userSlice.getInitialState(),
      [feedSlice.name]: feedSlice.getInitialState(),
      [сonstructorSlice.name]: сonstructorSlice.getInitialState()
    };

    const state = rootReducer(undefined, { type: '' });

    expect(state).toEqual(initialState);
  });
});
