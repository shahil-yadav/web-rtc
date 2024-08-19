import { Link } from 'react-router-dom'
import { Head } from '~/components/shared/Head'

function Page404() {
  return (
    <>
      <Head title="The page is not found" />
      <main className="flex h-full flex-col items-center justify-center px-16">
        <h1 className="text-2xl font-bold text-error">404: Not Found</h1>
        <p>
          The room you entered is not availaible on the server.{' '}
          <span className="font-semibold text-primary">Please check your URL</span>
        </p>
        <Link className="my-10 self-start text-secondary underline underline-offset-4" to="/">
          ➡️ Go to Vidloom
        </Link>
      </main>
    </>
  )
}

export default Page404
