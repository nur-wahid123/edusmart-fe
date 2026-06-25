'use client'
import { setDocumentTitle } from "@/util/util";
import { useEffect } from "react";

export default function Page(){
  useEffect(()=>{
    setDocumentTitle('Dashboard Admin Sekolah',"")
  },[])
  return (
    <div>
      <p>Admin Sekolah</p>
    </div>
  )
}