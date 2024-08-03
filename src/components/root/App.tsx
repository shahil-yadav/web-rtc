import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '~/components/contexts/UserContext';
import Main from '~/components/root/Main';
import { ToastProvider } from '../contexts/ToastContext';

export const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <Main />
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};
