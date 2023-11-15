"use client";

import EmailViewer from "./components/EmailViewer";
import TableResults from "./components/TableResults";
import EmailForm from "./components/EmailForm";
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react";


export default function Home() {
  const [results, setResults] = useState({});
  const [preview, setPreview] = useState("")

  return (
    <>
    <main className="p-8 mx-auto flex flex-col gap-4">
        
        <div className="flex gap-4">
            <div className="basis-5/12">
              <EmailForm setResults={setResults} setPreview={setPreview} />
            </div>
            <div className="basis-7/12 border p-4">
              <TableResults results={results} />
              <EmailViewer preview={preview} />
            </div>
            
        </div>
    </main>
    <Toaster />
    </>
  )
}
