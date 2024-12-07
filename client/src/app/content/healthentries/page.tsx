'use client'
import useFetch from "@/app/hooks/useFetch";
import { Table } from "../../components/Table";
import LoadingMessage from "@/app/components/LoadingMessage";
import ErrorMessage from "@/app/components/ErrorMessage";
import authorize from "@/app/lib/authorize";
import { TableWithUpdate } from "@/app/components/TableWithUpdate";
import { useState } from "react";
import { useRouter } from "next/navigation";




export default function ConsultantAndHealthEntries() {
  //authorize returns userId
  const userId = authorize();
  // const userId = 1;
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL as string;

  //get consultant and health entries for user
  const consultantURL = `${url}/consultant-for-user/${userId}`;
  const healthEntryURL = `${url}/health-entries/${userId}`;
  const updateUrl = `healthentries/update`

  const {
    data: consultantData,
    error: consultantError,
    loading: consultantLoading
  } = useFetch<string[][]>(consultantURL, { method: "GET" });

  const {
    data: healthEntryData,
    error: healthEntryError,
    loading: healthEntryLoading
  } = useFetch<string[][]>(healthEntryURL, { method: "GET" });



  const handleUpdate = async (healthEntryId: number) => { 
    router.push(`${updateUrl}/${healthEntryId}`)
}



  return (
    <>
      {/* Displays Consultant Info */}
      {consultantLoading ? (
        <LoadingMessage />
      ) : consultantError ? (
        <ErrorMessage message="Error loading consultant information" />
      ) : (
        <Table
          header="Consultant"
          column={["Title", "Name", "Education", "Email"]}
          data={consultantData ? consultantData : [["Currently no consultant assigned"]]}
        />
      )}
    
      {/* Displays Health Entries */}
      {healthEntryLoading ? (
        <LoadingMessage />
      ) : healthEntryError ? (
        <ErrorMessage message="Error loading health entries information" />
      ) : (
        <TableWithUpdate
          header="Health Entries"
          column={["Id", "Date", "Notes", "Prescription", "Treatment", "userId", "consultantId"]}
          data={healthEntryData ? healthEntryData : [["Currently no health entries available"]]}
    
           handleUpdate={handleUpdate} />
      )}
      <div className="flex space-x-2">
        <a
          href="/content/healthentries/create"
          className="w-full bg-blue-600 text-center text-white mt-2 p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Health Entry
        </a>
        <a
          href="/content/healthentries/summary"
          className="w-full bg-blue-600 text-center text-white mt-2 p-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Summary
        </a>
      </div>


    </>
  );
}
