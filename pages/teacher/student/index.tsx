import DefaultLayout from "../../../components/DefaultLayout";
import Head from "next/head";
import {FormEvent, Fragment, useEffect, useState} from "react";
import axios from "axios";
import {PlusCircleIcon, TrashIcon} from "@heroicons/react/outline";
import {Transition, Dialog} from "@headlessui/react";
import {format} from "date-fns";

export default function QuizPage() {
  type Student = {
    id: string,
    name: string,
    email: string,
    role: string,
    createdAt: Date,
  };

  const [students, setStudents] = useState<Student[]>([]);
  const [showStudentAddDialog, setShowStudentAddDialog] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get('/api/student')
      .then(({status, data}) => {
        if (status === 200) {
          setStudents(data);
        }
      }).catch(console.error);
  }, []);

  function handleDelete(id: string) {
    axios
      .delete(`/api/student/${id}`)
      .then(({status, data}) => {
        if (status === 200) {
          setStudents(data);
        }
      }).catch(console.error);
  }

  function handleAdd(e: FormEvent) {
    axios
      .post(`/api/student/`, {name, email})
      .then(({status, data}) => {
        if (status === 201) {
          setStudents(data);
          setShowStudentAddDialog(false)
        }
      }).catch(console.error);

    e.preventDefault();
  }

  return <>
    <Head>
      <title>Students | Quiz App</title>
    </Head>

    <Transition appear show={showStudentAddDialog} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {
        setShowStudentAddDialog(false)
      }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25"/>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <form onSubmit={handleAdd} className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md transform rounded-md overflow-hidden bg-white p-6 py-12 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h2"
                  className="text-heading text-center mb-12"
                >
                  Add Student
                </Dialog.Title>

                <div className='space-y-4'>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="name"
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        value={name}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        value={email}
                        required
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <button type="submit" className="btn-primary w-full">
                    Send invitation
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </form>
        </div>
      </Dialog>
    </Transition>

    <DefaultLayout>
      <div className='container mx-auto space-y-8 max-w-4xl px-8 mt-16'>
        <div className='flex items-center justify-between'>
          <h1 className='text-heading'>All Students</h1>
          <div onClick={() => {
            setShowStudentAddDialog(true)
          }}>
            <div className='btn-primary space-x-2'>
              <PlusCircleIcon className='h-5 w-auto'/>
              <span>
              Add Student
            </span>
            </div>
          </div>
        </div>

        <div className='w-full bg-white shadow rounded'>
          <div className='px-12 py-16 overflow-x-auto'>
            {students && students.length > 0 ?
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                <tr>
                  <th scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                    Name
                  </th>
                  <th scope="col"
                      className="py-3.5 pl-4 pr-3 text-center text-xs font-semibold uppercase text-gray-500 sm:pl-6">
                    Added On
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white">
                {students && students.map((student, idx) => (
                  <tr key={student.id} className={idx % 2 === 0 ? undefined : 'bg-gray-100 rounded'}>
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {student.name}
                    </td>
                    <td
                      className="whitespace-nowrap px-3 py-3 text-sm text-center text-gray-500">{format(new Date(student.createdAt), 'd MMMM, yyyy')}</td>
                    <td className="relative whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className='flex justify-end'>
                        <div onClick={() => handleDelete(student.id)}
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
                <p className='font-bold'>No Student Invited.</p>
              </div>}
          </div>
        </div>
      </div>
    </DefaultLayout>
  </>
}