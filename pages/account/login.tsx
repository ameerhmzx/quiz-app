import DefaultLayout from "../../components/DefaultLayout";
import {useRouter} from "next/router";
import axios from "axios";
import {FormEvent, useContext, useEffect, useState} from "react";
import {setToken} from "../../lib/auth";
import Head from "next/head";
import LoaderContext from "../../context/LoaderContext";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {setLoading} = useContext(LoaderContext);

  useEffect(() => {
    setError('')
  }, [email, password]);

  function login() {
    setLoading(true);
    axios.post(
      `/api/account/signin`,
      {email, password}
    ).then(r => {
      setLoading(false);
      if (r.status === 200) {
        setToken(r.data.token);
        router.push('/');
      }
    }).catch(err => {
      console.log(err);
      setLoading(false);
      if (err.response.data && err.response.data.error)
        setError(err.response.data.error);
    });
  }

  function handleSubmit(e: FormEvent) {
    login();
    e.preventDefault();
  }

  return <>
    <Head>
      <title>Login | Quiz App</title>
    </Head>

    <DefaultLayout>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mb-16 text-center text-heading">Log in to Quiz App</h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <div className='text-sm bg-red-100 text-red-900 py-2 px-4 rounded-md capitalize'>
                  {error}
                </div>}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      value={email}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      value={password}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="text-sm">
                  <div onClick={() =>
                    router.push('/account/register')}
                       className="font-medium duration-200 cursor-pointer text-green-800 hover:text-green-600">
                    Don&apos;t have account?
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </>;
}