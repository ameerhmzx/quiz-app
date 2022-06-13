import Head from "next/head";
import DefaultLayout from "../../components/DefaultLayout";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import {ClipboardListIcon} from "@heroicons/react/outline";
import LoaderContext from "../../context/LoaderContext";

export default function StudentPage() {
  type Quiz = {
    id: string,
    name: string,
    teacherName: string,
    totalMarks?: number,
    obtainedMarks?: number,
  };

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const {setLoading} = useContext(LoaderContext);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/quiz')
      .then(({status, data}) => {
        setLoading(false);
        if (status === 200) {
          setQuizzes(data);
        }
      }).catch((e) => {
      console.log(e);
      setLoading(false);
    });
  }, [setLoading]);

  return <>
    <Head>
      <title>Student | Quiz App</title>
    </Head>

    <DefaultLayout>
      <div className='container mx-auto space-y-8 max-w-4xl px-8 mt-16'>
        <div className='flex items-center justify-between'>
          <h1 className='text-heading'>All Quizzes</h1>
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
                    Teacher
                  </th>
                  <th scope="col"
                      className="py-3.5 pl-4 pr-3 text-right text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                    Result
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white">
                {quizzes && quizzes.map((quiz, idx) => (
                  <tr key={quiz.id} className={idx % 2 === 0 ? undefined : 'bg-gray-100 rounded'}>
                    <td
                      className="whitespace-nowrap space-x-2 py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <div className='flex items-center space-x-2'>
                        <ClipboardListIcon className='w-4'/>
                        <div>{quiz.name}</div>
                      </div>
                    </td>
                    <td
                      className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">{quiz.teacherName}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      <div className='flex justify-end'>{
                        quiz.obtainedMarks !== undefined ? <div>
                            {quiz.obtainedMarks} / {quiz.totalMarks}
                          </div> :
                          <Link href={`/student/${quiz.id}`}>
                            <div className='btn-secondary'>
                              Attempt
                            </div>
                          </Link>
                      }</div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              : <div className='flex items-center justify-center'>
                <p className='font-bold'>Yay! No Quiz Available.</p>
              </div>}
          </div>
        </div>
      </div>
    </DefaultLayout>
  </>;
}