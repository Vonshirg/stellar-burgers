import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  ResetPassword,
  Register
} from '../../pages';
import '../../index.css';
import styles from './app.module.css';
import { Preloader } from '../ui/preloader';
import { ProtectedRouteProps } from '../../utils/types';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import { useEffect, FC, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { resetOrder } from '../../services/slices/constructorSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import {
  getUser,
  isAuthCheckedSelector,
  userDataSelector
} from '../../services/slices/userSlice';

const ProtectedRoute: FC<ProtectedRouteProps> = ({ onlyUnAuth, children }) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);
  const loginRequest = useSelector((state) => state.user.loginRequest);
  const location = useLocation();
  if (!isAuthChecked && loginRequest) {
    return <Preloader />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  if (onlyUnAuth && user) {
    const from =
      (location.state as { from: { pathname: string } })?.from || '/';
    return <Navigate replace to={from} />;
  }
  return <>{children}</>;
};

const App: FC = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, [dispatch]);

  const modalRoutes = [
    {
      path: '/feed/:number',
      element: (
        <Modal
          title={'Информация о заказе'}
          onClose={() => {
            dispatch(resetOrder());
            handleModalClose();
          }}
        >
          <OrderInfo />
        </Modal>
      )
    },
    {
      path: '/ingredients/:id',
      element: (
        <Modal title={'Подробности ингредиента'} onClose={handleModalClose}>
          <IngredientDetails />
        </Modal>
      )
    },
    {
      path: '/profile/orders/:number',
      element: (
        <ProtectedRoute>
          <Modal
            title={'Информация о заказе'}
            onClose={() => {
              dispatch(resetOrder());
              handleModalClose();
            }}
          >
            <OrderInfo />
          </Modal>
        </ProtectedRoute>
      )
    }
  ];

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          {modalRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      )}
    </div>
  );
};

export default App;
