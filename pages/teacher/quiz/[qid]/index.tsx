import {useEffect} from "react";
import {useRouter} from "next/router";

export default function TeacherPage() {
  const router = useRouter();
  const {qid} = router.query;

  useEffect(() => {
    if (!qid) return;
    router.push(`/teacher/quiz/${qid}/edit`);
  }, [router, qid]);

  return <></>;
}