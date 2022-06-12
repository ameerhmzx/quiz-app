import {PropsWithChildren} from "react";
import Header from "./Header";

export default function DefaultLayout({children}: PropsWithChildren) {
  return <div className='min-h-full'>
    <Header/>
    <div className='h-full'>
      {children}
    </div>
  </div>;
}