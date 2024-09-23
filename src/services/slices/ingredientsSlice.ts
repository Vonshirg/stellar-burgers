import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestState, TIngredient, TIngredientState } from '@utils-types';
import { getIngredientsApi } from '@api';

export const getIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/getIngredients',
  async () => await getIngredientsApi()
);

const initialState: TIngredientState = {
  data: [],
  status: RequestState.Pending
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.status = RequestState.Loading;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.status = RequestState.Success;
        state.data = action.payload;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.status = RequestState.Failed;
      });
  },
  selectors: {
    ingredientsDataSelector: (state) => state.data,
    ingredientsStatusSelector: (state) => state.status
  }
});

export const { ingredientsDataSelector, ingredientsStatusSelector } =
  ingredientsSlice.selectors;
