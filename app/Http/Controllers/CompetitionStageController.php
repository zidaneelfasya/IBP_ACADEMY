<?php

namespace App\Http\Controllers;

use App\Models\CompetitionStage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompetitionStageController extends Controller
{
    public function index()
    {
        $stages = CompetitionStage::orderBy('order')
            ->get()
            ->map(fn ($stage) => [
                'id'         => $stage->id,
                'name'       => $stage->name,
                'startDate'  => $stage->start_date->format('Y-m-d'),
                'endDate'    => $stage->end_date->format('Y-m-d'),
            ]);

        return Inertia::render('admin/Timeline/Index', [
            'stages' => $stages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
        ]);

        $validated['order'] = (CompetitionStage::max('order') ?? 0) + 1;

        CompetitionStage::create($validated);

        return redirect()->back()->with('success', 'Stage created successfully');
    }

    public function update(Request $request, CompetitionStage $stage)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
        ]);

        $stage->update($validated);

        return redirect()->back()->with('success', 'Stage updated successfully');
    }

    public function destroy(CompetitionStage $stage)
    {
        $stage->delete();
        return redirect()->back()->with('success', 'Stage deleted successfully');
    }
}
