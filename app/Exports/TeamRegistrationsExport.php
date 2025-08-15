<?php

namespace App\Exports;

use App\Models\TeamRegistration;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class TeamRegistrationsExport implements FromCollection, WithHeadings, WithStyles, WithMapping
{
    public function collection()
    {
        return TeamRegistration::with(['competitionCategory', 'user'])->get();
    }

    private function formatDate($date): string
    {
        if (!$date) return '';
        
        if (is_string($date)) {
            try {
                return Carbon::parse($date)->format('Y-m-d H:i:s');
            } catch (\Exception $e) {
                return $date; // return original string if parsing fails
            }
        }
        
        if ($date instanceof \Carbon\Carbon || $date instanceof \DateTime) {
            return $date->format('Y-m-d H:i:s');
        }
        
        return '';
    }

    public function map($teamRegistration): array
    {
        return [
            $teamRegistration->id,
            $teamRegistration->uuid,
            $teamRegistration->registration_number,
            $teamRegistration->tim_name,
            $teamRegistration->leader_name,
            $teamRegistration->leader_nim,
            $teamRegistration->leader_email,
            $teamRegistration->leader_phone,
            $teamRegistration->leader_univ,
            $teamRegistration->leader_fakultas,
            $teamRegistration->member1_name,
            $teamRegistration->member1_nim,
            $teamRegistration->member1_email ?? '',
            $teamRegistration->member1_phone ?? '',
            $teamRegistration->member1_univ ?? '',
            $teamRegistration->member1_fakultas ?? '',
            $teamRegistration->member2_name,
            $teamRegistration->member2_nim,
            $teamRegistration->member2_email ?? '',
            $teamRegistration->member2_phone ?? '',
            $teamRegistration->member2_univ ?? '',
            $teamRegistration->member2_fakultas ?? '',
            $teamRegistration->link_berkas,
            $teamRegistration->competitionCategory?->name ?? 'N/A',
            $teamRegistration->status,
            $teamRegistration->admin_notes ?? '',
            $this->formatDate($teamRegistration->registered_at),
            $this->formatDate($teamRegistration->created_at),
            $this->formatDate($teamRegistration->updated_at)
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'UUID',
            'Registration Number',
            'Team Name',
            'Leader Name',
            'Leader NIM',
            'Leader Email',
            'Leader Phone',
            'Leader University',
            'Leader Faculty',
            'Member 1 Name',
            'Member 1 NIM',
            'Member 1 Email',
            'Member 1 Phone',
            'Member 1 University',
            'Member 1 Faculty',
            'Member 2 Name',
            'Member 2 NIM',
            'Member 2 Email',
            'Member 2 Phone',
            'Member 2 University',
            'Member 2 Faculty',
            'Link Berkas',
            'Competition Category',
            'Status',
            'Admin Notes',
            'Registered At',
            'Created At',
            'Updated At'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}