"use client"
import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import { TableWithDelete } from "../components/TableWithDelete";
import useFetch from "../hooks/useFetch";
import { Table } from "../components/Table";

//manage all user
export default function UserPage() {

    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const userDeleteUrl = `${url}/users`;
    const userDataURL = `${url}/users`;
    const usersInAllProgramsURL = `${url}/users-in-all-programs`;
    const {
        data: UserData,
        setData,
        error: UserError,
        loading: UserLoading
    } = useFetch<string[][]>(userDataURL, { method: "GET" });

    const {
        data: usersInAllProgramsData,
        error: usersInAllProgramsError,
        loading: usersInAllProgramsLoading
    } = useFetch<string[][]>(usersInAllProgramsURL, { method: "GET" });

    const [deleteError, setDeleteError] = useState("")
    const handleDelete = async (userId: number) => { 
        try {
            const response = await fetch(`${userDeleteUrl}/${userId}`, { method: 'DELETE' })
            const responseData = (await response.json())
            console.log(responseData)
            if (!response.ok) { throw new Error(responseData.error) }
            setDeleteError(`Successfully deleted user ${userId}`)

            const newUserDataResponse = await fetch(`${userDataURL}`)
            const newUserData = (await newUserDataResponse.json())
            setData(newUserData);

        } catch (error: any) {
            console.log(error.message)
            setDeleteError(error.message)
        }

    }


    return (<>
        {deleteError ? <ErrorMessage message={deleteError} /> : <></>}
        {UserLoading ? (
            <LoadingMessage />
        ) : UserError ? (
            <ErrorMessage message="Error loading users information" />
        ) : (

            <TableWithDelete
                header="Manage Users"
                column={["Id", "First Name", "Last Name", "Dob", "Consultant id"]}
                data={UserData ? UserData : [["Currently no user"]]}
                handleDelete={handleDelete} />
        )}
 
        {usersInAllProgramsLoading ? (
            <LoadingMessage />
        ) : usersInAllProgramsError ? (
            <ErrorMessage message="Error loading information of users in all programs" />
        ) : (

            <Table
                header="Users In All Programs"
                column={["Id", "First Name", "Last Name"]}
                data={usersInAllProgramsData ? usersInAllProgramsData : [["Currently no user"]]} />
        )}

    </>)
}