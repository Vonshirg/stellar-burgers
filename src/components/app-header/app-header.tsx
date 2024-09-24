import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { userDataSelector } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const user = useSelector(userDataSelector);
  const userName = user ? user.name : '';
  return <AppHeaderUI userName={userName} />;
};
