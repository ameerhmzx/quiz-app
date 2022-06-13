import {useEffect} from "react";
import {useRouter} from "next/router";

export default function TeacherPage() {

  const router = useRouter();
  useEffect(() => {
    router.push('/teacher/quiz');
  }, [router]);

  return <></>;
}