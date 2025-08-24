<?php

namespace App\Console\Commands;

use App\Models\CompetitionStage;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckDeadlineCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:deadline';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check registration deadline status';

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

        $now = Carbon::now();
        $deadline = Carbon::parse($stage->end_date);

        $this->info('=== Registration Deadline Check ===');
        $this->info('Current Date: ' . $now->format('Y-m-d H:i:s T'));
        $this->info('Deadline: ' . $deadline->format('Y-m-d H:i:s T'));
        $this->info('Days until deadline: ' . $now->diffInDays($deadline, false));

        if ($now->greaterThan($deadline)) {
            $this->error('⚠️  DEADLINE HAS PASSED!');
            $this->error('Registration is CLOSED');
        } else {
            $this->info('✅ Registration is OPEN');
            $this->info('Time remaining: ' . $deadline->diffForHumans($now));
        }

        return Command::SUCCESS;
    }
}
