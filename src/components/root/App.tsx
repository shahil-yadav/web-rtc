import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '~/components/contexts/UserContext'
import Main from '~/components/root/Main'
import StreamsProvider from '../contexts/StreamsContext'
import { Toaster } from 'react-hot-toast'

export const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <StreamsProvider>
          <>
            <Main />
            <Toaster />
          </>
        </StreamsProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}
