import DefaultLayout from "../../../components/DefaultLayout";
import Head from "next/head";
import {FormEvent, Fragment, useState} from "react";
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid'
import axios from "axios";
import {useRouter} from "next/router";
import {TrashIcon} from "@heroicons/react/outline";

export default function NewQuiz() {

  const router = useRouter();

  type Question = {
    title: string,
    option1: string,
    option2: string,
    option3: string,
    option4: string,
    answer: number,
  }

  const newQuestion = {
    title: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: 0
  };

  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([{...newQuestion}]);

  function handleSave(e: FormEvent) {
    axios
      .post(
        '/api/quiz',
        {
          name: name,
          questions: questions
        }
      )
      .then(({status}) => {
        if (status === 201) {
          router.push('/teacher/quiz')
        }
      })
      .catch(console.error);
    e.preventDefault()
  }

  function handleAddQuestion() {
    setQuestions([...questions, {...newQuestion}]);
  }

  function handleDeleteQuestion(idx: number) {
    const newList = questions.filter((question, index) => index !== idx);
    if (newList.length === 0) {
      setQuestions([{...newQuestion}]);
    } else setQuestions(newList);
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

    <DefaultLayout>
      <form onSubmit={handleSave} className='container mx-auto space-y-8 max-w-4xl px-8 my-16 pb-16'>

        <div className='flex items-center justify-between'>
          <h1 className='text-heading'>Create New Quiz</h1>
          <button type='submit'>
            <div className='btn-primary space-x-2'>
              <span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H13.3333L17.5 6.66667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.1666 17.5V10.8333H5.83325V17.5" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"/>
                  <path d="M5.83325 2.5V6.66667H12.4999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round"/>
                </svg>
              </span>
              <span>Save</span>
            </div>
          </button>
        </div>

        {/*Quiz Name*/}
        <div className='w-full bg-white shadow rounded px-12 py-8'>
          <div>
            <label htmlFor="title" className="block text-xs uppercase font-medium text-gray-500">
              Quiz Name
            </label>
            <div className="mt-1">
              <input
                id="title"
                name="title"
                type="name"
                value={name}
                placeholder="A Quick Quiz"
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
              />
            </div>
          </div>
        </div>

        {/*Questions*/}
        {
          questions && questions.map((question, idx) => (
            <div key={idx} className='w-full bg-white shadow rounded px-12 py-8'>

              <div className='flex justify-end'>
                <div onClick={() => handleDeleteQuestion(idx)} className='duration-200 hover:bg-red-100 hover:text-red-600 p-2 rounded cursor-pointer'>
                  <TrashIcon className='w-5' />
                </div>
              </div>

              <div>
                <div>
                  <label htmlFor={`question-${idx}`} className="block text-xs uppercase font-medium text-gray-500">
                    Question
                  </label>
                  <div className="mt-1">
                    <input
                      id={`question-${idx}`}
                      name={`question-${idx}`}
                      type="text"
                      value={question.title}
                      onChange={(e) => {
                        questions[idx].title = e.target.value;
                        setQuestions([...questions]);
                      }}
                      required
                      className="input"
                    />
                  </div>
                </div>

                {/*Options*/}
                <div className={'grid mt-12 sm:grid-cols-2 gap-8'}>
                  <div>
                    <label htmlFor={`question-${idx}-option-1`}
                           className="block text-xs uppercase font-medium text-gray-500">
                      Option A
                    </label>
                    <div className="mt-1">
                      <input
                        id={`question-${idx}-option-1`}
                        name={`question-${idx}-option-1`}
                        type="text"
                        value={question.option1}
                        onChange={(e) => {
                          questions[idx].option1 = e.target.value;
                          setQuestions([...questions]);
                        }}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`question-${idx}-option-2`}
                           className="block text-xs uppercase font-medium text-gray-500">
                      Option B
                    </label>
                    <div className="mt-1">
                      <input
                        id={`question-${idx}-option-2`}
                        name={`question-${idx}-option-2`}
                        type="text"
                        value={question.option2}
                        onChange={(e) => {
                          questions[idx].option2 = e.target.value;
                          setQuestions([...questions]);
                        }}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`question-${idx}-option-3`}
                           className="block text-xs uppercase font-medium text-gray-500">
                      Option C
                    </label>
                    <div className="mt-1">
                      <input
                        id={`question-${idx}-option-3`}
                        name={`question-${idx}-option-3`}
                        type="text"
                        value={question.option3}
                        onChange={(e) => {
                          questions[idx].option3 = e.target.value;
                          setQuestions([...questions]);
                        }}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`question-${idx}-option-4`}
                           className="block text-xs uppercase font-medium text-gray-500">
                      Option D
                    </label>
                    <div className="mt-1">
                      <input
                        id={`question-${idx}-option-4`}
                        name={`question-${idx}-option-4`}
                        type="text"
                        value={question.option4}
                        onChange={(e) => {
                          questions[idx].option4 = e.target.value;
                          setQuestions([...questions]);
                        }}
                        required
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                {/*Answer*/}
                <div className='mt-8 max-w-[200px]'>
                  <label className='block text-xs uppercase font-medium text-gray-500'>
                    Correct Option
                    <Listbox value={question.answer} onChange={(value) => {
                      questions[idx].answer = value;
                      setQuestions([...questions]);
                    }}>
                      <div className="relative mt-1 w-full">
                        <Listbox.Button
                          className="relative w-full flex justify-start bg-green-900 text-white py-2 px-4 rounded capitalize">
                          <span className="block truncate pr-5">{options[question.answer]}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <SelectorIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {options.map((option, optionIdx) => (
                              <Listbox.Option
                                key={optionIdx}
                                className={({active}) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-green-100 text-green-900' : 'text-gray-900'
                                  }`
                                }
                                value={optionIdx}
                              >
                                {({selected}) => (
                                  <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {option}
                                  </span>{selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                    </span>
                                  ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </label>
                </div>
              </div>

            </div>
          ))
        }

        <div className='flex justify-center'>
          <div onClick={handleAddQuestion} className='btn-secondary'>Add Question</div>
        </div>
      </form>
    </DefaultLayout>
  </>;
}