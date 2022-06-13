import DefaultLayout from "../../../components/DefaultLayout";
import Head from "next/head";
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import {PlusCircleIcon} from "@heroicons/react/outline";

export default function QuizPage() {
  type Quiz = {
    id: string,
    name: string,
    updatedAt: Date,
    submitCount: number,
  };

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    axios
      .get('/api/quiz')
      .then(({status, data}) => {
        if (status === 200) {
          setQuizzes(data);
        }
      }).catch(console.error);
  }, []);

  return <>
    <Head>
      <title>Quiz | Quiz App</title>
    </Head>

    <DefaultLayout>
      <div className='container mx-auto space-y-8 max-w-4xl px-8 mt-16'>
        <div className='flex items-center justify-between'>
          <h1 className='text-heading'>All Quizzes</h1>
          <Link href={"/teacher/quiz/new"}>
            <div className='btn-primary space-x-2'>
              <PlusCircleIcon className='h-5 w-auto'/>
              <span>
              New Quiz
            </span>
            </div>
          </Link>
        </div>

        <div className='w-full bg-white shadow rounded'>
          <div className='px-12 py-16'>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="">
              <tr>
                <th scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                  Name
                </th>
                <th scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                  Last Modified
                </th>
                <th scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                  Submitted By
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
              </thead>
              <tbody className="bg-white">
              {quizzes && quizzes.map((quiz, idx) => (
                <tr key={quiz.id} className={idx % 2 === 0 ? undefined : 'bg-gray-100 rounded'}>
                  <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {quiz.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">{quiz.updatedAt.toString()}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">{quiz.submitCount}</td>
                  <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link href={`/teacher/quiz/${quiz.id}/edit`}
                          className="cursor-pointer text-indigo-600 hover:text-indigo-900">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </>
}