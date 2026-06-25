'use client'
import { setDocumentTitle } from "@/util/util";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    setDocumentTitle('Dashboard Superadmin', "")
  }, [])
  return (
    <div>
      <p>Superadmin</p>
    </div>
  )
}