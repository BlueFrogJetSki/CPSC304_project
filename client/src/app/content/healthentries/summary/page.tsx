'use client'
import useFetch from "@/app/hooks/useFetch";

import LoadingMessage from "@/app/components/LoadingMessage";
import ErrorMessage from "@/app/components/ErrorMessage";
import authorize from "@/app/lib/authorize";
import { Table } from "@/app/components/Table";




export default function ConsultantAndHealthEntries() {
  //authorize returns userId
  const userId = authorize();
  // const userId = 2;

  const url = process.env.NEXT_PUBLIC_API_URL as string;

  const healthEntryURL = `${url}/health-entries-summary/${userId}`;
  const frequentTreatmentsURL = `${url}/frequent-treatments/${userId}`;
  const consultantTreatmentCountURL = `${url}/nested-health-entries/${userId}`;


  const {
    data: healthEntryData,
    error: healthEntryError,
    loading: healthEntryLoading
  } = useFetch<string[][]>(healthEntryURL, { method: "GET" });

  const {
    data: frequentTreatmentsData,
    error: frequentTreatmentsError,
    loading: frequentTreatmentsLoading
  } = useFetch<string[][]>(frequentTreatmentsURL, { method: "GET" });

  const {
    data: consultantTreatmentCountData,
    error: consultantTreatmentCountError,
    loading: consultantTreatmentCountLoading
  } = useFetch<string[][]>(consultantTreatmentCountURL, { method: "GET" });

  

  return (
    <>
    

      {/* Displays treatment count */}
      {healthEntryLoading ? (
        <LoadingMessage />
      ) : healthEntryError ? (
        <ErrorMessage message="Error loading health entry summary information" />
      ) : (
        <Table
          header="Health Entry Treatment Count"
          column={["Treatment", "Count"]}
          data={healthEntryData ? healthEntryData : [["Currently no health entries available" ]]}
        />
      )}

       {/* Displays frequent treatment */}
       {frequentTreatmentsLoading ? (
        <LoadingMessage />
      ) : frequentTreatmentsError ? (
        <ErrorMessage message="Error loading health entry summary information" />
      ) : (
        <Table
          header="Frequent treatments"
          column={["Treatment", "Count"]}
          data={frequentTreatmentsData ? frequentTreatmentsData : [["Currently no health entries available" ]]}
        />
      )}

      {/* Displays counsultant treatment count */}
      {consultantTreatmentCountLoading ? (
        <LoadingMessage />
      ) : consultantTreatmentCountError ? (
        <ErrorMessage message="Error loading health entry summary information" />
      ) : (
        <Table
          header="Consultant Treatment Count"
          column={["Consultant Id", "Treatment", "Treatment Count"]}
          data={consultantTreatmentCountData ? consultantTreatmentCountData : [["Currently no health entries available" ]]}
        />
      )}
    

    </>
  );
}
