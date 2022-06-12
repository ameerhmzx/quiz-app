import {PropsWithChildren, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {isAuthenticated} from '../lib/auth';

export default function ValidateRoute({children}: PropsWithChildren) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const authenticationRoutes: string[] = [
    "/account/login",
    "/account/register",
  ];

  const verifyRoute = (url: string) => {
    const path = url.split('?')[0].replace(/^\/$/, '');
    if (!isAuthenticated() && !authenticationRoutes.includes(path.replace(/\/$/, ''))) {
      setAllowed(false);
      router.push({pathname: '/account/login'});
    } else if (isAuthenticated() && authenticationRoutes.includes(path.replace(/\/$/, ''))){
      router.push({pathname: '/'});
    } else {
      setAllowed(true);
    }
  }

  useEffect(() => {
    verifyRoute(router.asPath);

    router.events.on('routeChangeStart', () => setAllowed(false));
    router.events.on('routeChangeComplete', verifyRoute)

    return () => {
      router.events.off('routeChangeStart', () => setAllowed(false));
      router.events.off('routeChangeComplete', verifyRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <> {allowed && children} </>;
}