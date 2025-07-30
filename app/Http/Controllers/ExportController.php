<?php

namespace App\Http\Controllers;

use App\Exports\TeamRegistrationsExport;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function exportTeamRegistrations()
    {
        return Excel::download(new TeamRegistrationsExport, 'team_registrations.xlsx');
    }
}