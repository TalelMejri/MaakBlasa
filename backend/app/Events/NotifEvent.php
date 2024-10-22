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
    private $userId;
    public function __construct($notif,$userId)
    {
        $this->notif = $notif;
        $this->userId=$userId;
    }

    public function broadcastWith()
    {
        return ['message' => $this->notif,'userId'=>$this->userId];
    }

    public function broadcastOn()
    {
        return new PrivateChannel("public.{$this->userId}");
    }
}
