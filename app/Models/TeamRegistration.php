<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'tim_name',
        'asal_universitas',
        'prodi_fakultas',
        'leader_name',
        'leader_nim',
        'leader_email', // disarankan pisahkan email leader
        'leader_phone', // disarankan tambahkan
        'member1_name',
        'member1_nim',
        'member2_name',
        'member2_nim',
        'member3_name',
        'member3_nim',
        'link_berkas', // bisa berupa dokumen awal (twibbon, bukti follow, dsb)
        'status', // ini bisa dipakai sebagai status pendaftaran: pending/verified/rejected
        'kategori_lomba', // dari form register (BCC / BPC)
    ];
    protected $casts = [
        'status' => 'string',
    ];
    public function progress()
    {
        return $this->hasMany(ParticipantProgress::class, 'participant_id');
    }
}
