import {setToken, isAuthenticated} from "../lib/auth";
import {useRouter} from "next/router";
import {LogoutIcon} from "@heroicons/react/outline";

export default function Header() {
  const router = useRouter();

  function logout() {
    setToken();
    router.push('/account/login');
  }

  return <div className='w-full bg-green-900'>
    <div className='flex container mx-auto py-2'>
      {isAuthenticated() && <button className='justify-self-end btn-primary space-x-2' onClick={logout}>
          <LogoutIcon className='h-5 w-auto'/>
          <span>Sign out</span>
      </button>}
    </div>
  </div>;
}
