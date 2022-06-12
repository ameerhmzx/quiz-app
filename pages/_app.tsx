import '../styles/globals.css'
import type {AppProps} from 'next/app'
import ValidateRoute from "../components/ValidateRoute";

function MyApp({Component, pageProps}: AppProps) {
  return <ValidateRoute>
    <Component {...pageProps} />
  </ValidateRoute>
}

export default MyApp
