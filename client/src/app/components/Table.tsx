import React from 'react';

interface Props {
    header: string;
    column: string[];  // Array of column headers
    data: string[][];  // 2D array for table rows and columns
}

export function Table({ header, column, data }: Props) {
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
                    </tr>
                </thead>
                <tbody>
                    {data.map((values, index) => (
                        <tr key={index} className="w-full hover:bg-gray-100">
                            {values.map((value, cellIndex) => (
                                <td key={cellIndex} className="py-2 px-4 border-b text-center">
                                    {value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
