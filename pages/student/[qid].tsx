import Head from "next/head";
import {FormEvent, useContext, useEffect, useState} from "react";
import {RadioGroup} from '@headlessui/react'
import axios from "axios";
import {useRouter} from "next/router";
import {ArrowCircleLeftIcon, ArrowCircleRightIcon} from "@heroicons/react/outline";
import DefaultLayout from "../../components/DefaultLayout";
import {CheckIcon} from "@heroicons/react/solid";
import Link from "next/link";
import LoaderContext from "../../context/LoaderContext";

export default function TakeQuizApp() {
  const router = useRouter();
  const {qid} = router.query;

  type Question = {
    id: number,
    title: string,
    option1: string,
    option2: string,
    option3: string,
    option4: string,
  }

  type Answer = {
    questionId: number,
    selected: number,
  }

  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map<number, number>());
  const [result, setResult] = useState<{ obtained: number, total: number } | undefined>(undefined);
  const {setLoading} = useContext(LoaderContext);

  useEffect(() => {
    if (!qid) return;
    setLoading(true);
    axios
      .get(`/api/quiz/${qid}`)
      .then(({status, data}) => {
        setLoading(false);
        if (status === 200) {
          setName(data.name);
          setQuestions(data.questions);
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [qid, setLoading]);

  function handleSubmit(e: FormEvent) {
    let submit_answers: Answer[] = [];

    answers.forEach((value, key) => {
      submit_answers.push({
        questionId: key,
        selected: value
      });
    });

    setLoading(true);
    axios
      .post(
        `/api/quiz/${qid}`,
        {
          answers: submit_answers
        }
      )
      .then(({status, data}) => {
        setLoading(false);
        if (status === 201) {
          setResult({
            total: data.totalMarks,
            obtained: data.obtainedMarks
          });
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
    e.preventDefault();
  }

  let options = [
    "Option A",
    "Option B",
    "Option C",
    "Option D",
  ];

  return <>
    <Head>
      <title>Create New Quiz | Quiz App</title>
    </Head>

    {result && name ? <DefaultLayout>
      <div className='container mx-auto space-y-8 max-w-4xl px-8 my-16 pb-16'>
        <h1 className='text-heading'>Results: {name}</h1>
        <div className='w-full bg-white shadow rounded px-12 py-14'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <p className='text-gray-500 text-xs font-bold'>You Have Scored</p>
            <p className='text-green-900 text-4xl font-bold'>{result.obtained} / {result.total}</p>
          </div>
        </div>
        <Link href={'/student'}>
          <div className='flex items-center justify-center space-x-2 text-green-900 cursor-pointer'>
            <ArrowCircleLeftIcon className='w-4'/>
            <p className='font-bold text-sm'>Go Back to all Quizzes</p>
          </div>
        </Link>
      </div>
    </DefaultLayout> : <DefaultLayout>
      {questions && name &&
          <form onSubmit={handleSubmit} className='container mx-auto space-y-8 max-w-4xl px-8 my-16 pb-16'>

              <div className='flex items-center justify-between'>
                  <h1 className='text-heading'>Create New Quiz</h1>
                  <button type='submit'>
                      <div className='btn-primary space-x-2'>
                          <span>Submit</span>
                          <ArrowCircleRightIcon className='w-5'/>
                      </div>
                  </button>
              </div>

            {/*Questions*/}
            {
              answers && questions && questions.map((question) => (
                <div key={question.id} className='w-full bg-white shadow rounded px-12 py-8'>

                  <div>
                    {/*Options*/}

                    <RadioGroup value={answers.get(question.id)} onChange={(value) => {
                      if (value !== undefined) {
                        setAnswers(new Map(answers.set(question.id, value)))
                      }
                    }}>
                      <RadioGroup.Label>
                        <h6 className='font-bold'>
                          {question.title}:
                        </h6>
                      </RadioGroup.Label>

                      <div className='mt-4 grid sm:grid-cols-2 gap-4'>
                        {
                          [question.option1, question.option2, question.option3, question.option4].map((opt, index) => (
                            <RadioGroup.Option key={index} value={index}>
                              {({checked}) => (
                                <div
                                  className={`relative flex justify-between cursor-pointer rounded-md px-5 py-4 border focus:outline-none ${checked ? 'bg-green-900 bg-opacity-75 text-white' : 'bg-green-50'}`}>
                                  <div>
                                    <p
                                      className={`text-xs ${checked ? 'text-green-50' : 'text-gray-600'}`}>{options[index]}</p>
                                    <p className='text-sm'>{opt}</p>
                                  </div>

                                  {checked && (
                                    <CheckIcon className="h-6 w-6 self-center shrink-0 text-white"/>
                                  )}
                                </div>
                              )}
                            </RadioGroup.Option>
                          ))
                        }
                      </div>

                    </RadioGroup>

                  </div>
                </div>
              ))
            }
          </form>
      }
    </DefaultLayout>}
  </>;
}