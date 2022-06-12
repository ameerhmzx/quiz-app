import {setToken, isAuthenticated} from "../lib/auth";
import {useRouter} from "next/router";

export default function Header() {
  const router = useRouter();

  return <div className='w-full bg-green-900'>
    <div className='h-10 flex container mx-auto'>
      {isAuthenticated() && <button onClick={() => {
        setToken();
        router.push('/account/login');
      }}>Sign out
      </button>}
    </div>
  </div>;
}
