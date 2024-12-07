'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  url: string
  method:string
  data?:string[]
  redirectURL:string
}

const mapToHealhEntryData = (arr1:string[], arr2:string[])=>{
  const result: { [key: string]: string | Date} = {}; // Initialize result as an object
  for (let i = 0; i < arr1.length; i++) {
    const col = arr1[i]; // Key
    const val = arr2[i]; // Value
    result[col] = val; // Assign key-value pair
  }
  result.Date = new Date(result.Date);
  return result as unknown as HealthEntryData;
}
export default function HealthEntryInput({ url,method, data,redirectURL }: Props) {
  const [formData, setFormData] = useState<HealthEntryData>({
    Id: 0,
    Date: new Date(),
    Notes: "",
    Prescription: "",
    Treatment: "",
    userId: 0,
    consultantId: 0,
  });

  const router = useRouter();

  useEffect(() => {
    if (data) {
      const columns = ["Id", "Date", "Prescription", "Treatment", "Notes", "userId", "consultantId"]
      const healthEntryObj = mapToHealhEntryData(columns, data)
      console.log(healthEntryObj)
      setFormData(healthEntryObj); // Only update formData if data is provided
    }
  }, [data]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageVisiable, setErrorMessageVisiable] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    submitData.Date = (submitData.Date as Date).toISOString().split("T")[0]
    console.log(JSON.stringify(submitData));
    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to submit: ${error.error}`);
      }
      console.log("Form submitted successfully!");
      router.push(redirectURL);

    } catch (error: any) {
      console.log("Error submitting form:", error);
      //display error message
      setErrorMessage(error.message);
      setErrorMessageVisiable(true);
    }
  };



  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Health Entry Form {method}</h1>
      <form onSubmit={handleSubmit}>
        {[
          { label: "Date", name: "Date", type: "Date", value: (formData.Date as Date).toISOString().split("T")[0]},
          { label: "Notes", name: "Notes", type: "text", value: formData.Notes  },
          { label: "Prescription", name: "Prescription", type: "text", value: formData.Prescription },
          { label: "Treatment", name: "Treatment", type: "text", value: formData.Treatment  },
          { label: "User ID", name: "userId", type: "number", value: formData.userId },
          { label: "Consultant ID", name: "consultantId", type: "number", value: formData.consultantId },
        ].map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block text-gray-700 mb-2" htmlFor={field.name}>
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={field.value as string | number}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.name !== "Notes" && field.name !== "Prescription" && field.name !== "Treatment"}
            />
          </div>
        ))}
        <p className={`text-red-500 mb-2 ${errorMessageVisiable ? "block" : "hidden"}`}>
          {errorMessage}
        </p>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

