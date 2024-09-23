import {
  PayloadAction,
  createSlice,
  nanoid,
  createAsyncThunk
} from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  RequestState,
  TBurgerConstructorState
} from '@utils-types';
import { getOrdersApi, orderBurgerApi, getOrderByNumberApi } from '@api';

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
  order: null,
  orders: [],
  RequestState: RequestState.Pending
};

export const сonstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addToConstructor: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      }),
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      }
    },
    removeFromConstructor: (state, { payload }: PayloadAction<number>) => {
      state.ingredients.splice(payload, 1);
    },
    reorderConstructor: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const ingredients = [...state.ingredients];
      ingredients.splice(to, 0, ingredients.splice(from, 1)[0]);
      state.ingredients = ingredients;
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    resetOrder: (state) => {
      state.order = null;
      state.RequestState = RequestState.Pending;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrder.pending, (state) => {
        state.RequestState = RequestState.Loading;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.RequestState = RequestState.Success;
        state.order = action.payload.order;
        state.orders.push(action.payload.order);
      })
      .addCase(makeOrder.rejected, (state) => {
        state.RequestState = RequestState.Failed;
      })
      .addCase(getOrder.pending, (state) => {
        state.RequestState = RequestState.Loading;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.RequestState = RequestState.Success;
        state.order = action.payload.orders[0];
        const newOrders = action.payload.orders.filter(
          (order) =>
            !state.orders.some(
              (existingOrder) => existingOrder._id === order._id
            )
        );
        state.orders.push(...newOrders);
      })
      .addCase(getOrder.rejected, (state) => {
        state.RequestState = RequestState.Failed;
      })
      .addCase(getOrders.pending, (state) => {
        state.RequestState = RequestState.Loading;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.RequestState = RequestState.Success;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state) => {
        state.RequestState = RequestState.Failed;
      });
  },
  selectors: {
    constructorBunSelector: (state: TBurgerConstructorState) => state.bun,
    constructorIngredientsSelector: (state: TBurgerConstructorState) =>
      state.ingredients,
    orderDataSelector: (state: TBurgerConstructorState) => state.order,
    orderStatusSelector: (state: TBurgerConstructorState) => state.RequestState,
    ordersDataSelector: (state: TBurgerConstructorState) => state.orders
  }
});

export const {
  addToConstructor,
  removeFromConstructor,
  reorderConstructor,
  resetConstructor,
  resetOrder
} = сonstructorSlice.actions;

export const {
  constructorBunSelector,
  constructorIngredientsSelector,
  orderDataSelector,
  orderStatusSelector,
  ordersDataSelector
} = сonstructorSlice.selectors;

export default сonstructorSlice.reducer;

export const makeOrder = createAsyncThunk(
  'order/makeOrder',
  async (ingredients: string[]) => {
    const order = await orderBurgerApi(ingredients);
    return order;
  }
);

export const getOrder = createAsyncThunk(
  'order/getOrder',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

export const getOrders = createAsyncThunk<TOrder[]>(
  'order/getOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);
