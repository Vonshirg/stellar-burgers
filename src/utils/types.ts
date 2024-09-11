export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
  order: TOrder | null;
  orders: TOrder[];
  RequestState: RequestState;
};

export enum RequestState {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
  Loading = 'Loading'
}

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: RequestState;
};

export type TIngredientState = {
  data: TIngredient[];
  status: RequestState;
};

export interface TUserState {
  error: string | null;
  isAuthChecked: boolean;
  user: TUser | null;
  loginRequest: boolean;
  RequestState: RequestState;
}
export type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export type TTabMode = 'bun' | 'sauce' | 'main';
