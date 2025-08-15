<?php

namespace App\Exports;

use App\Models\TeamRegistration;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TeamRegistrationsSimpleExport implements FromCollection, WithHeadings, WithStyles, WithMapping
{
    public function collection()
    {
        return TeamRegistration::with('competitionCategory')->get();
    }

    public function map($teamRegistration): array
    {
        return [
            $teamRegistration->registration_number,
            $teamRegistration->tim_name,
            $teamRegistration->leader_name,
            $teamRegistration->leader_nim,
            $teamRegistration->leader_email,
            $teamRegistration->leader_univ,
            $teamRegistration->member1_name ?? '',
            $teamRegistration->member1_nim ?? '',
            $teamRegistration->member2_name ?? '',
            $teamRegistration->member2_nim ?? '',
            $teamRegistration->competitionCategory?->name ?? 'N/A',
            $teamRegistration->status,
            $teamRegistration->created_at->format('Y-m-d H:i:s')
        ];
    }

    public function headings(): array
    {
        return [
            'No. Registrasi',
            'Nama Tim',
            'Nama Ketua',
            'NIM Ketua',
            'Email Ketua',
            'Universitas Ketua',
            'Nama Anggota 1',
            'NIM Anggota 1',
            'Nama Anggota 2',
            'NIM Anggota 2',
            'Kategori Lomba',
            'Status',
            'Tanggal Daftar'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Auto-size semua kolom
        foreach (range('A', 'M') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

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
                        'rgb' => 'D9E1F2'
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