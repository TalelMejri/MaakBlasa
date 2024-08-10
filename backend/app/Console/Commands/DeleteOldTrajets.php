<?php

namespace App\Console\Commands;

use App\Models\trajet;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DeleteOldTrajets extends Command
{
    protected $signature = 'trajet:delete-old';
    protected $description = 'Delete trajets older than 3 hours';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $now = Carbon::now();
        $threshold = $now->addHours(12);
        try {
            $deletedCount = trajet::whereRaw('CONCAT(date, " ", heure) < ?', [$threshold->format('Y-m-d H:i:s')])->delete();
            $this->info($deletedCount . ' old trajets deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete old trajets: ' . $e->getMessage());
            $this->error('Failed to delete old trajets.');
        }
    }
}
