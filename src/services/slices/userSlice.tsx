import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestState, TUserState } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const login = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  logoutApi().then(() => {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  });
});

export const register = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const responce = await registerUserApi(data);
    setCookie('accessToken', responce.accessToken);
    localStorage.setItem('refreshToken', responce.refreshToken);
    return responce.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

const initialState: TUserState = {
  user: null,
  loginRequest: false,
  error: null,
  isAuthChecked: false,
  RequestState: RequestState.Pending
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.RequestState = RequestState.Loading;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.RequestState = RequestState.Success;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.RequestState = RequestState.Failed;
        state.error = action.error.message!;
      })
      .addCase(login.pending, (state) => {
        state.RequestState = RequestState.Loading;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.RequestState = RequestState.Success;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.RequestState = RequestState.Failed;
        state.error = action.error.message!;
      })
      .addCase(getUser.pending, (state) => {
        state.RequestState = RequestState.Loading;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.RequestState = RequestState.Success;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.RequestState = RequestState.Loading;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.RequestState = RequestState.Success;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.RequestState = RequestState.Failed;
        state.error = action.error.message!;
      })
      .addCase(logout.pending, (state) => {
        state.RequestState = RequestState.Loading;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
        state.RequestState = RequestState.Success;
      })
      .addCase(logout.rejected, (state, action) => {
        state.RequestState = RequestState.Failed;
        state.error = action.error.message!;
      });
  },
  selectors: {
    isAuthCheckedSelector: (state: TUserState) => state.isAuthChecked,
    userRequestState: (state: TUserState) => state.RequestState,
    userDataSelector: (state: TUserState) => state.user,
    errorSelector: (state: TUserState) => state.error
  }
});

export const {
  userDataSelector,
  userRequestState,
  isAuthCheckedSelector,
  errorSelector
} = userSlice.selectors;

export default userSlice.reducer;
