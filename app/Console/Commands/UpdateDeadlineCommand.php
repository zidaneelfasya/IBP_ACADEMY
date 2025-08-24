<?php

namespace App\Console\Commands;

use App\Models\CompetitionStage;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateDeadlineCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:deadline {days=7 : Number of days from now}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update registration deadline for testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $stage = CompetitionStage::where('name', 'Registration')
            ->where('order', 1)
            ->first();

        if (!$stage) {
            $this->error('Registration stage not found!');
            return Command::FAILURE;
        }

        $days = (int) $this->argument('days');
        $newDeadline = Carbon::now()->addDays($days);

        $stage->update([
            'end_date' => $newDeadline
        ]);

        $this->info('✅ Registration deadline updated!');
        $this->info('New deadline: ' . $newDeadline->format('Y-m-d H:i:s T'));
        $this->info('Days from now: ' . $days);

        return Command::SUCCESS;
    }
}
