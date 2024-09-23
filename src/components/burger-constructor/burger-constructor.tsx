import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  resetConstructor,
  constructorBunSelector,
  constructorIngredientsSelector
} from '../../services/slices/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import { makeOrder } from '../../services/slices/constructorSlice';
import {
  resetOrder,
  orderDataSelector,
  orderStatusSelector
} from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';
import { userDataSelector } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorBun = useSelector(
    constructorBunSelector
  ) as TConstructorIngredient;
  const constructorIngredients = useSelector(
    constructorIngredientsSelector
  ) as TConstructorIngredient[];
  const constructorItems = {
    bun: constructorBun,
    ingredients: constructorIngredients
  };

  const orderStatusRequest = useSelector(orderStatusSelector);
  const orderRequest = orderStatusRequest === 'Loading' ? true : false;
  const orderModalData = useSelector(orderDataSelector);
  const user = useSelector(userDataSelector);
  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientsIds = [
      constructorBun._id,
      ...constructorIngredients.map((ing) => ing._id),
      constructorBun._id
    ];

    dispatch(makeOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
