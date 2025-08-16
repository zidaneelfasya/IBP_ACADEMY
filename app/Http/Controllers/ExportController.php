<?php

namespace App\Http\Controllers;

use App\Exports\TeamRegistrationsExport;
use App\Exports\TeamRegistrationsSimpleExport;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function exportTeamRegistrations()
    {
        return Excel::download(new TeamRegistrationsExport, 'team_registrations_full.xlsx');
    }

    public function exportTeamRegistrationsSimple()
    {
        return Excel::download(new TeamRegistrationsSimpleExport, 'team_registrations_simple.xlsx');
    }
}