'use client'
import { AppContext } from "@/user-components/contexts/app.context";
import Statistics from "@/user-components/dashboard/statistics";
import { setDocumentTitle } from "@/util/util";
import { useContext, useEffect } from "react";

export default function Page(){
  useEffect(()=>{
    setDocumentTitle('Dashboard Wangasa',"")
  },[])
  return (
    <div>
      <Statistics/>
    </div>
  )
}