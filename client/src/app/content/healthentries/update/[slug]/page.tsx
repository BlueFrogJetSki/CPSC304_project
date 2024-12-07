'use client'
import HealthEntryInput from "@/app/components/HealthEntryInput";


export default async function HealthEntryUpdatePage({
    params,
  }: {
    params: Promise<{ slug: number }>
  }) {
    
    const slug = (await params).slug
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const healthEntryUpdateURL = `${url}/health-entries/${slug}`;
    const healthEntryDataURL = `${url}/health-entry/${slug}`
    
    const response = await fetch(healthEntryDataURL, {method:"GET"})
    const data = (await response.json())

    //TODO use data
    return (<HealthEntryInput url={healthEntryUpdateURL} data={data[0]} method={"PUT"} redirectURL={"../"} />)
}