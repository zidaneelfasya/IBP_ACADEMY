<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'leader_name',
        'leader_nim',
        'member1_name',
        'member1_nim',
        'member2_name',
        'member2_nim',
        'member3_name',
        'member3_nim',
        'link_berkas',
        'email',
        'link_tugas',

    ];
}
