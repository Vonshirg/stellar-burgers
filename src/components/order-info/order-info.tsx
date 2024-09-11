import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { ordersDataSelector } from '../../services/slices/constructorSlice';
import { ingredientsDataSelector } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../services/slices/constructorSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const ingredients: TIngredient[] = useSelector(ingredientsDataSelector);
  const orders = useSelector(ordersDataSelector);

  const dispatch = useDispatch();
  const { number } = useParams();

  useEffect(() => {
    dispatch(getOrder(Number(number)));
  }, [dispatch, number]);

  const order = orders.find((order) => order.number === Number(number));

  const orderData = order
    ? {
        ...order,
        ingredients: order!.ingredients.map(
          (ingredient: TIngredient | string) =>
            typeof ingredient === 'string' ? ingredient : ingredient._id
        )
      }
    : undefined;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
