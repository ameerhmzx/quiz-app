import DefaultLayout from "../../../components/DefaultLayout";
import Head from "next/head";
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import {ClipboardListIcon, DocumentTextIcon, PencilAltIcon, PlusCircleIcon, TrashIcon} from "@heroicons/react/outline";
import {formatDistanceToNow} from "date-fns";

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

  function handleDelete(id: string) {
    axios
      .delete(`/api/quiz/${id}`)
      .then(({status}) => {
        if (status === 200) {
          setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
        }
      })
      .catch(console.error);
  }

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

        <div className='w-full bg-white shadow rounded '>
          <div className='px-12 py-16 overflow-x-auto'>
            {quizzes && quizzes.length > 0 ?
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="">
                <tr>
                  <th scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                    Name
                  </th>
                  <th scope="col"
                      className="py-3.5 pl-4 pr-3 text-center text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                    Last Modified
                  </th>
                  <th scope="col"
                      className="py-3.5 pl-4 pr-3 text-center text-xs font-semibold uppercase text-gray-500 sm:pl-6">
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
                      <div className='flex items-center space-x-2'>
                        <ClipboardListIcon className='w-4'/>
                        <div>{quiz.name}</div>
                      </div>
                    </td>
                    <td
                      className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{formatDistanceToNow(new Date(quiz.updatedAt)) + " ago"}</td>
                    <td
                      className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 text-center">{quiz.submitCount}</td>
                    <td
                      className="relative whitespace-nowrap text-right pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className='flex items-center justify-end'>
                        <Link href={`/teacher/quiz/${quiz.id}/result`}>
                          <div
                            className="duration-200 hover:bg-green-100 hover:text-green-700 p-2 rounded cursor-pointer">
                            <DocumentTextIcon className='w-5'/>
                          </div>
                        </Link>
                        <Link href={`/teacher/quiz/${quiz.id}/edit`}>
                          <div
                            className="duration-200 hover:bg-green-100 hover:text-green-700 p-2 rounded cursor-pointer">
                            <PencilAltIcon className='w-5'/>
                          </div>
                        </Link>
                        <div onClick={() => handleDelete(quiz.id)}
                             className='duration-200 hover:bg-red-100 hover:text-red-600 p-2 rounded cursor-pointer'>
                          <TrashIcon className='w-5'/>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              : <div className='flex items-center justify-center'>
                <p className='font-bold'>No Quiz Created Yet.</p>
              </div>}
          </div>
        </div>
      </div>
    </DefaultLayout>
  </>
}