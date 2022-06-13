import {useRouter} from "next/router";
import {useEffect} from "react";
import {getPayload} from "../lib/auth";

// Redirected to student or teacher

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.push(getPayload()?.role === 'teacher' ? '/teacher/quiz' : '/student');
  }, [router]);

  return <></>;
}