import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

export default function AdminCode() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin-code.verify'));
    };

    return (
        <GuestLayout>
          <Head title="Admin Code Verification" />
          <form onSubmit={submit}>
                <input
                    type="text"
                    className="w-full border rounded p-2 mb-2"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="Contoh: AB3D9F"
                />
                {errors.code && <div className="text-red-500 text-sm">{errors.code}</div>}

                <button
                    type="submit"
                    className="mt-3 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    disabled={processing}
                >
                    Verifikasi Kode
                </button>
            </form>
        </GuestLayout>
    );
}
