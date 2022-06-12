import DashboardLayout from "../components/DashboardLayout";
import {setToken} from "../lib/auth";
import Head from "next/head";

export default function HomePage() {
  return <>
    <Head>
      <title>Quiz App</title>
    </Head>

    <DashboardLayout>
      <button onClick={() => setToken()}>Logout</button>
    </DashboardLayout>
  </>;
}