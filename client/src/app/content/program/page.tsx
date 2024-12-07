'use client'
import authorize from "@/app/lib/authorize";
import { Table } from "../../components/Table";
import useFetch from "@/app/hooks/useFetch";
import LoadingMessage from "@/app/components/LoadingMessage";
import ErrorMessage from "@/app/components/ErrorMessage";
//displays all programs 
export default function Program() {
    
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const programURL = `${url}/programs`;
    const {
        data: programData,
        error: programError,
        loading: programLoading
    } = useFetch<string[][]>(programURL, { method: "GET" });

    return (

        <>
            {/* Displays Program Info */}
            {programLoading ? (
                <LoadingMessage />
            ) : programError ? (
                <ErrorMessage message="Error loading Program information" />
            ) : (
                <Table
                    header="Program"
                    column={["Id", "Name", "Description"]}
                    data={programData ? programData : [[  "Currently no program assigned" ]]}
                />
            )}
        </>
    )
}