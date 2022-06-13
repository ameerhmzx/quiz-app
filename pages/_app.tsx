import '../styles/globals.css'
import type {AppProps} from 'next/app'
import ValidateRoute from "../components/ValidateRoute";
import LoaderContext from "../context/LoaderContext"
import {useState} from "react";

function MyApp({Component, pageProps}: AppProps) {
  const [isLoading, setLoading] = useState(false);

  return <ValidateRoute>
    <LoaderContext.Provider value={{setLoading}}>
      {/* Loader */}
      {isLoading &&
          <div className={'fixed overflow-hidden w-full top-0 left-0 w-full h-1 z-50'}>
              <div className="absolute h-1 w-full opacity-50 bg-green-600"/>
              <div className="absolute h-1 bg-green-500 inc"/>
              <div className="absolute h-1 bg-green-500 dec"/>
          </div>
      }
      <Component {...pageProps} />
    </LoaderContext.Provider>
  </ValidateRoute>
}

export default MyApp
