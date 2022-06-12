import {PropsWithChildren} from "react";
import Header from "./Header";

export default function DashboardLayout({children}: PropsWithChildren) {
  return <div className='min-h-full'>
    <Header/>
    <div className='h-full'>
      {children}
    </div>
  </div>;
}