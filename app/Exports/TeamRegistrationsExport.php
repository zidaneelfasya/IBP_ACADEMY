<?php

namespace App\Exports;

use App\Models\TeamRegistration;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TeamRegistrationsExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return TeamRegistration::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nama Ketua',
            'NIM Ketua',
            'Nama Anggota 1',
            'NIM Anggota 1',
            'Nama Anggota 2',
            'NIM Anggota 2',
            'Nama Anggota 3',
            'NIM Anggota 3',
            'Link Berkas',
            'Email',
            'Link Tugas',
            'Created At',
            'Updated At'
        ];
    }
}