'use client'
import authorize from "@/app/lib/authorize";
import { Table } from "../../components/Table";
import useFetch from "@/app/hooks/useFetch";
import LoadingMessage from "@/app/components/LoadingMessage";
import ErrorMessage from "@/app/components/ErrorMessage";

export default function Device() {
    //authorize returns userId
    const userId = authorize();
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const deviceURL = `${url}/devices/${userId}`;
    const {
        data: deviceData,
        error: deviceError,
        loading: deviceLoading
    } = useFetch<string[][]>(deviceURL, { method: "GET" });

    return (

        <>
            {/* Displays device Info */}
            {deviceLoading ? (
                <LoadingMessage />
            ) : deviceError ? (
                <ErrorMessage message="Error loading device information" />
            ) : (
                <Table
                    header="Device"
                    column={["Id", "model", "type", 'userId']}
                    data={deviceData ? deviceData : [ ["Currently no device assigned"]]}
                />
            )}
        </>
    )
}