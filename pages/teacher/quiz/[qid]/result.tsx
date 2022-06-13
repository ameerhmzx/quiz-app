import Head from "next/head";
import DefaultLayout from "../../../../components/DefaultLayout";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {format} from "date-fns";
import Link from "next/link";
import {
  ArrowCircleLeftIcon,
  TrashIcon
} from "@heroicons/react/outline";

export default function ResultPage() {
  const router = useRouter();
  const {qid} = router.query;

  type Result = {
    id: number,
    name: string,
    quizName: string,
    submittedAt: Date,
    obtainedMarks: number,
    totalMarks: number,
  };

  const [results, setResults] = useState<Result[] | undefined>(undefined);
  const [quizName, setQuizName] = useState("");


  useEffect(() => {
    if (!qid) return;
    axios
      .get(`/api/quiz/${qid}/result`)
      .then(({status, data}) => {
        if (status === 200) {
          setQuizName(data.name);
          setResults(data.results);
        }
      })
      .catch(console.error);
  }, [qid]);

  function handleDelete(id: number) {
    if (!qid) return;
    axios
      .delete(`/api/quiz/${qid}/result/${id}`)
      .then(({status, data}) => {
        if (status === 200) {
          setResults(results?.filter((res) => res.id !== data.id))
        }
      })
      .catch(console.error);
  }

  return <>
    <Head>
      <title>
        Results | Quiz App
      </title>
    </Head>

    <DefaultLayout>
      {results &&
          <div className='container mx-auto space-y-8 max-w-4xl px-8 my-16 pb-16'>
              <Link href={'/student'}>
                  <div className='flex items-center justify-start space-x-2 text-green-900 cursor-pointer'>
                      <ArrowCircleLeftIcon className='w-6'/>
                      <p className='font-bold text-2xl'>Results: <span className='font-normal'>{quizName}</span></p>
                  </div>
              </Link>

              <div className='w-full bg-white shadow rounded '>
                  <div className='px-12 py-16 overflow-x-auto'>
                      <table className="min-w-full divide-y divide-gray-300">
                          <thead className="">
                          <tr>
                              <th scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                                  Name
                              </th>
                              <th scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                                  Submitted On
                              </th>
                              <th scope="col"
                                  className="py-3.5 pl-4 pr-3 text-center text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                                  Result
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                  <span className="sr-only">Delete</span>
                              </th>
                          </tr>
                          </thead>
                          <tbody className="bg-white">
                          {results && results.map((result, idx) => (
                            <tr key={result.id} className={idx % 2 === 0 ? undefined : 'bg-gray-100 rounded'}>
                              <td
                                className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                <div>{result.name}</div>
                              </td>
                              <td
                                className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{format(new Date(result.submittedAt), 'd MMMM, yyyy')}</td>
                              <td
                                className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{result.obtainedMarks} / {result.totalMarks}</td>
                              <td
                                className="relative whitespace-nowrap text-right pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className='flex items-center justify-end'>
                                  <div onClick={() => handleDelete(result.id)}
                                       className='duration-200 hover:bg-red-100 hover:text-red-600 p-2 rounded cursor-pointer'>
                                    <TrashIcon className='w-5'/>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>}
    </DefaultLayout>
  </>;
}