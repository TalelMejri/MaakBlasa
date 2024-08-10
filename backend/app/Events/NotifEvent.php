<?php

namespace App\Events;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotifEvent implements ShouldBroadcastNow
{
    use SerializesModels;
    private $notif;
    private $tab;
    public function __construct($notif,$tab)
    {
        $this->notif = $notif;
        $this->tab=$tab;
    }

    public function broadcastWith()
    {
        return ['message' => $this->notif,'tab'=>$this->tab];
    }

    public function broadcastOn()
    {
        return new Channel('public');
    }
}
