//displays conditions that the user has
'use client'
import { Table } from "../../components/Table";
import useFetch from "@/app/hooks/useFetch";
import LoadingMessage from "@/app/components/LoadingMessage";
import ErrorMessage from "@/app/components/ErrorMessage";
import { useState } from "react";

export default function Condition() {

    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const conditionURL = `${url}/conditions`;
    const searchURL = `${url}/search-conditions`
    const {
        data: conditionData,
        setData,
        error: conditionError,
        setError,
        loading: conditionLoading
    } = useFetch<string[][]>(conditionURL, { method: "GET" });

    const [conditionString, setConditionString] = useState("");

    const handleSubmit = async () => {
        //submit the conditionString
        const body = { "conditionString": conditionString }

        try {
            let response;
            //if conditionString is empty, fetch all conditions
            //elese search for condition string
            if (conditionString == "") {
                response = await fetch(conditionURL)

            } else {
                response = await fetch(searchURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Specify the body format
                    },
                    body: JSON.stringify(body)
                })
            }

            //display the result

            const responseData = (await response.json())
            console.log(responseData)
            if (!response.ok) { throw new Error(responseData.error) }
            setError(null)
            setData(responseData);
            console.log(conditionData)
        } catch (error: any) {
            console.log(error.message)
            setError(error.message)
        }

    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setConditionString(value);
    };

    return (

        <>
            {/* Search Box */}
            <div className="flex items-center space-x-2">
                <label htmlFor="search" className="text-lg font-medium text-gray-700">Search</label>
                <input
                    type="text"
                    id="search"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specify attributes and condition with 'AND' or 'OR'"
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
            {/* Displays condition Info */}
            {conditionLoading ? (
                <LoadingMessage />
            ) : conditionError ? (
                <ErrorMessage message={conditionError} />
            ) : (
                <Table
                    header="Conditions"
                    column={["scientific_name", "description", "treatment"]}
                    data={conditionData ? conditionData : [["Currently no condition assigned"]]}
                />
            )}


        </>
    )
}