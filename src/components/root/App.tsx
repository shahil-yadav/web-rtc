import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '~/components/contexts/UserContext'
import Main from '~/components/root/Main'
import { ToastProvider } from '../contexts/ToastContext'
import StreamsProvider from '../contexts/StreamsContext'

export const App = () => {
  return (
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <StreamsProvider>
            <Main />
          </StreamsProvider>
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  )
}
