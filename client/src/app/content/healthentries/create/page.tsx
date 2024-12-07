'use client'
import HealthEntryInput from "@/app/components/HealthEntryInput";

export default function HealthEntryFormPage()
{
   
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const healthEntryPostURL = `${url}/health-entries`;
    return( <HealthEntryInput url={healthEntryPostURL} method={"POST"} redirectURL={"../healthentries"}/>)
}