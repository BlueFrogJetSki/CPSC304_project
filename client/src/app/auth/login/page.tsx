'use client'
import { setCookie } from '@/app/lib/cookie';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
    const [userId, setUserId] = useState('');
    const [loginResult, setLoginResult] = useState<string | null>(null);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        const url = process.env.NEXT_PUBLIC_API_URL as string;
        const loginURL = `${url}/login`;
        e.preventDefault();

        try {
            //define data in fetch
            const body = { Id: userId }
            console.log(body)
            const response = await fetch(loginURL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json" // Set content type to JSON
                    },
                    body: JSON.stringify(body)
                });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }



            setCookie("userId", userId, 1);
            setLoginResult('login successful');
            
            router.push('/')



        } catch (err) {
            //handle incorrect login credentials
            setLoginResult('userId does not exist');
            console.log(err)
        }

    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="userid">
                        UserId
                    </label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter your user id"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
            {loginResult ?
                <div className="mt-4 text-center">
                    <p className="text-red-500">
                        {loginResult}
                    </p>
                </div> : <></>
            }
            <div className="mt-4 text-center">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <a href="/auth/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}
