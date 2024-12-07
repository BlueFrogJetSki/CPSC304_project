import React, { useState } from 'react';
import ErrorMessage from './ErrorMessage';

interface Props {
    header: string;
    column: string[];  // Array of column headers
    data: Data[];  // 2D array for table rows and columns
    handleUpdate: (userId:number)=>void
}

export function TableWithUpdate({ header, column, data,handleUpdate }: Props) {
   
    return (
        <>
            <h2 className="p-2 text-2xl">{header}</h2>
           
            <table className="min-w-full py-2 bg-white border border-gray-300 rounded-lg">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        {/* Map to a list of strings called header */}
                        {column.map((column, index) => (
                            <th key={index} className="py-2 border-b">
                                {column}
                            </th>

                        ))}
                        <th className="py-2 border-b">
                            Update
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((obj, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            {Object.values(obj).map((value, cellIndex) => (
                                <td key={cellIndex} className="py-2 px-4 border-b">
                                    {value}
                                </td>
                            ))}

                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleUpdate(Object.values(obj)[0])} // assume Id is the first attribute in obj
                                    className="bg-blue-500 px-2 py-1 rounded text-white"
                                >
                                    Update
                                </button>
                            </td>

                        </tr>
                    ))}

                </tbody>
            </table>
        </>
    );
}
