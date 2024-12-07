'use client'
import authorize from "@/app/lib/authorize";
import { Table } from "../../components/Table";
import useFetch from "@/app/hooks/useFetch";
import ErrorMessage from "@/app/components/ErrorMessage";
import LoadingMessage from "@/app/components/LoadingMessage";
import { useState } from "react";

export default function Vitals() {
    //authorize returns userId
    const userId = authorize();
    // const userId = '1' //temp
    const url = process.env.NEXT_PUBLIC_API_URL as string;

    const [projectionAttributes, setProjectionAttribute] = useState(['', '', '', '', ''])
    const possibleColumns = ["device_id", "user_id", "time_recorded", "pulse_rate", "blood_pressure"]
    const vitalsURL = `${url}/vitals/${userId}`;
    const {
        data: VitalsData,
        setData,
        error: VitalsError,
        setError,
        loading: VitalsLoading
    } = useFetch<string[][]>(vitalsURL, { method: "POST", body: JSON.stringify({projectionAttributes: projectionAttributes})});

    const handleSelect = (indx: number) => (event: React.MouseEvent<HTMLDivElement>) => {
        setProjectionAttribute(prev => {
            const updatedAttributes = [...prev];

            //if not selected, change value to the associated string
            //else unselect by changing the value to ''
            if (updatedAttributes[indx] == '') {
                updatedAttributes[indx] = possibleColumns[indx]; // Update the specific index 
            } else {
                updatedAttributes[indx] = ''
            }
            return updatedAttributes;
        });
        console.log(projectionAttributes.join('') == '')
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        //if no attr selected
        try {
            let response;

            response = await fetch(vitalsURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Specify the body format
                },
                body: JSON.stringify({projectionAttributes: projectionAttributes})
            })
            const responseData = (await response.json())
            console.log(responseData)
            if (!response.ok) { throw new Error(responseData.error) }
            setError(null)
            setData(responseData);
        } catch (error: any) {
            console.log(error.message)
            setError(error.message)
        }
    }

    return (
        <>

            <div className="flex space-x-2 items-center bg-blue-200 p-2">
                <h2 className="text-xl">Select Attributes:</h2>
                {possibleColumns.map((val, index) => {
                    return (

                        <div key={index} onClick={handleSelect(index)} className={`${projectionAttributes[index] ? ' bg-blue-500 text-white' : 'bg-transparent text-black'} px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}>{val}</div>

                    )
                })}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>



            {VitalsLoading ? (
                <LoadingMessage />
            ) : VitalsError ? (
                <ErrorMessage message="Error loading vitals information" />
            ) : (
                <Table
                    header="Vitals"
                    column={projectionAttributes.join('') == ''?  possibleColumns: projectionAttributes }
                    data={VitalsData ? VitalsData : [["No vitals recorded"]]}
                />
            )}


        </>)
}