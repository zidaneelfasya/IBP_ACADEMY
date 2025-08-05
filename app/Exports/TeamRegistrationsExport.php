<?php

namespace App\Exports;

use App\Models\TeamRegistration;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;


class TeamRegistrationsExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection()
    {
        return TeamRegistration::all([
            'id',
            'leader_name',
            'leader_nim',
            'member1_name',
            'member1_nim',
            'member2_name',
            'member2_nim',
            'member3_name',
            'member3_nim',
            'link_berkas',
            'leader_email',
            'kategori_lomba',
            'status',
            'created_at',
            'updated_at'
        ]);
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
            'Email Ketua',
            'Kategori Lomba',
            'Status',
            'Created At',
            'Updated At'
        ];
    }
    public function styles(Worksheet $sheet)
    {
        // Styling untuk header (baris 1)
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => [
                        'rgb' => 'D9E1F2' // Warna biru muda ala Google Form
                    ]
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color' => ['argb' => 'FF000000'],
                    ],
                ],
            ]
        ];
    }
}
