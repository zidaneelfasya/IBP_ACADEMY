import React from 'react';
import { Head } from '@inertiajs/react';


export default function Forbidden() {
    return (
        <div>
            <Head title="403 Forbidden" />
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-4xl font-bold text-red-600">403</h1>
                <p className="text-xl mt-4">Forbidden</p>
                <p className="mt-2">You don't have permission to access this page.</p>
                <a href="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Return Home
                </a>
            </div>
        </div>
    );
}