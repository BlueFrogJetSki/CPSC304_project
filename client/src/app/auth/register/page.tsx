'use client'
import { setCookie } from "@/app/lib/cookie";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [consultantId, setConsultantId] = useState('');
    const [registerResult, setRegisterResult] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        const url = process.env.NEXT_PUBLIC_API_URL as string;
        const loginURL = `${url}/register`;
        e.preventDefault();

        const data = {
            firstName,
            lastName,
            dob,
            consultantId,
        };


        try {
             //define data in fetch
             const response = await fetch(loginURL, { method: "POST",body: JSON.stringify(data) });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            setRegisterResult('registration successful');
            const router = useRouter();
            router.push('/login')



        } catch (err) {
            //handle incorrect login credentials
            setRegisterResult('Registration failed, please try again');
        }

    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="firstname">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter your first name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="lastname">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter your last name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="dob">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="consultant_id">
                        Consultant ID
                    </label>
                    <input
                        type="text"
                        id="consultant_id"
                        value={consultantId}
                        onChange={(e) => setConsultantId(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter your consultant ID"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>
            {registerResult ? (
                <div className="mt-4 text-center">
                    <p className={registerResult === 'Registration successful' ? 'text-green-500' : 'text-red-500'}>
                        {registerResult}
                    </p>
                </div>
            ) : null}
            <div className="mt-4 text-center">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <a href="/auth/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}





