<?php

namespace App\Http\Controllers;

use App\Events\NotifEvent;
use App\Models\Alert;
use App\Models\Notif;
use App\Models\Option;
use App\Models\Request as ModelsRequest;
use App\Models\trajet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrajetController extends Controller
{
    public function AddTrajet(Request $request)
    {
        $alerts = Alert::All();
        $now = Carbon::now();
        $existingTrajet = Trajet::where('user_id', $request->user()->id)
            ->where('date', '>', $now->subMinutes(2))
            ->first();
        if ($existingTrajet) {
            return response()->json(['message' => 'You have an active trajet. Please complete or delete it before adding a new one.'], 400);
        }
        $trajet = new trajet();
        $trajet->depart = $request->depart;
        $trajet->arrivee = $request->arrivee;
        $trajet->date = $request->date;
        $trajet->heure = $request->heure;
        $trajet->nbplaces = $request->nbplaces;
        $trajet->nbplacesCurrent = 0;
        $trajet->user_id = $request->user()->id;
        $trajet->save();

        $tab = [];

        for ($i = 0; $i < count($alerts); $i++) {
            $requestDepart = $request->depart;
            $requestArrivee = $request->arrivee;

            $alertDepart = $alerts[$i]->depart;
            $alertArrivee = $alerts[$i]->destination;

            if (
                mb_strpos($requestDepart, $alertDepart) !== false &&
                mb_strpos($requestArrivee, $alertArrivee) !== false &&
                $alerts[$i]->date == $request->date
            ) {
                $tab[] = [
                    'id' => $alerts[$i]->user_id
                ];
                Alert::where('user_id', $alerts[$i]->user_id)->where('depart', $alerts[$i]->depart)->where('destination', $alerts[$i]->destination)->where('date', $alerts[$i]->date)->delete();
            }
        }
        if (count($tab) > 0) {
            for ($i = 0; $i < count($tab); $i++) {
                $notif = new Notif();
                $notif->user_id = $tab[$i]['id'];
                $notif->content = "ثنيتك موجودة";
                $notif->save();
            }
        }
        $data = json_decode($request->options, true);
        for ($i = 0; $i < count($data); $i++) {
            $option = new Option();
            $option->trajet_id = $trajet->id;
            $option->name = $data[$i]['name'];
            $option->save();
        }
        broadcast(new NotifEvent("ثنيتك موجودة", $tab));
        return response()->json(["data" => "Your Trajet Added"], 201);
    }

    public function getTrajets(Request $request)
    {
        $trajets = trajet::with(['user', 'requests.user'])
            ->whereHas('user', function ($query) use ($request) {
                $query->where('id', '=', $request->user()->id);
            })
            ->whereHas('requests', function ($query) {
                $query->where('status', '=', 0);
            })
            ->get();
        return response()->json($trajets);
    }

    public function getTrajetAccepted(Request $request)
    {
        $trajets = trajet::with(['user', 'requests.user'])
            ->whereHas('user', function ($query) use ($request) {
                $query->where('id', '=', $request->user()->id);
            })
            ->whereHas('requests', function ($query) {
                $query->where('status', '=', 1);
            })
            ->get();
        return response()->json($trajets);
    }

    public function getTrajet($id)
    {
        $trajet = trajet::with('user')->find($id);
        return response()->json($trajet);
    }

    public function deleteTrajet($id)
    {
        $trajets = ModelsRequest::where('trajet_id', $id)->get();
        $tab = [];
        if ($trajets) {
            for ($i = 0; $i < count($trajets); $i++) {
                $tab[] = [
                    'id' => $trajets[$i]->user_id
                ];
            }
        }
        $trajet = trajet::find($id);
        $trajet->delete();
        if (count($tab) > 0) {
            for ($i = 0; $i < count($tab); $i++) {
                $notif = new Notif();
                $notif->user_id = $tab[$i]['id'];
                $notif->content = "الله غالب الثنية إلي حبيت علاها تفسخت";
                $notif->save();
            }
        }
        broadcast(new NotifEvent("الله غالب الثنية إلي حبيت علاها تفسخت", $tab));
        return response()->json('trajet deleted');
    }

    public function FilterTrajet(Request $request)
    {

        $trajets = trajet::with('user')->with('option')->where('depart', 'like', '%' . $request->depart . '%')
            ->where('arrivee', 'like', '%' . $request->arrive . '%')
            ->where('date', 'like', '%' . $request->date . '%')
            ->where('nbplacesCurrent', '<', DB::raw('nbplaces'))
            ->where(DB::raw('nbplaces - nbplacesCurrent'), '>=', $request->nbr);

        if ($request->timeRange) {
            list($startTime, $endTime) = explode('-', $request->timeRange);
            $trajets = $trajets->whereTime('heure', '>=', $startTime)
                ->whereTime('heure', '<=', $endTime);
        }

        if ($request->options) {
            $options = json_decode($request->options, true);

            if (!empty($options['vipSeat'])) {
                $trajets = $trajets->whereHas('option', function ($query) {
                    $query->where('name', 'like', '%' . 'كليماتيزور' . '%');
                });
            }

            if (!empty($options['smoking'])) {
                $trajets = $trajets->whereHas('option', function ($query) {
                    $query->where('name', 'like', '%' . 'يتكيف' . '%');
                });
            }

            if (!empty($options['charging'])) {
                $trajets = $trajets->whereHas('option', function ($query) {
                    $query->where('name', 'like', '%' . 'إيشرجي' . '%');
                });
            }

            if (!empty($options['petFriendly'])) {
                $trajets = $trajets->whereHas('option', function ($query) {
                    $query->where('name', 'like', '%' . 'حيوانات' . '%');
                });
            }
        }

        $trajets = $trajets->get();

        return response()->json($trajets);
    }

    public function ReserverTrajet(Request $request)
    {
        $testFound = ModelsRequest::where('user_id', $request->user()->id)->where('trajet_id', $request->trajet_id)->first();
        if ($testFound) {
            return response()->json(["data" => "You have already requested this trajet"], 404);
        }
        $demande = new ModelsRequest();
        $demande->user_id = $request->user()->id;
        $demande->trajet_id = $request->trajet_id;
        $demande->status = 0;
        $demande->nbplaces = $request->nbplaces;
        $demande->save();
        $trajet = Trajet::find($request->trajet_id);
        $tab = [];
        $tab[] = [
            'id' => $trajet->user_id
        ];

        $notif = new Notif();
        $notif->user_id = $trajet->user_id;
        $notif->content = "عندك شكون إحب يطلع معاك";
        $notif->save();

        broadcast(new NotifEvent("عندك شكون إحب يطلع معاك ", $tab));
        return response()->json(["data" => $demande], 201);
    }

    public function getLatstNotif(Request $request)
    {
        $notif = Notif::where('user_id', $request->user()->id)->latest()->first();
        if (!$notif) {
            return response()->json([]);
        }
        return response()->json($notif);
    }

    public function DeleteAllNotif(Request $request)
    {
        $notif = Notif::where('user_id', $request->user()->id)->delete();
        return response()->json(["data" => "All Notif Deleted"], 200);
    }
    public function AccepterUser(Request $request)
    {
        $modelsRequest = ModelsRequest::where("user_id", $request->user_id)
            ->where("trajet_id", $request->trajet_id)
            ->first();

        if ($modelsRequest) {
            $modelsRequest->status = 1;
            $modelsRequest->save();
            $tab = [];
            $tab[] = [
                'id' =>  $request->user_id
            ];
            $notif = new Notif();
            $notif->user_id = $request->user_id;
            $notif->content = "مبروك تقبلت في طريق إللى حبيت علبه";
            $notif->save();
            $modelsRequests = ModelsRequest::where("trajet_id", "!=", $request->trajet_id)->where("user_id", "=", $request->user_id)->get();
            if ($modelsRequests) {
                foreach ($modelsRequests as $model) {
                    $model->delete();
                }
            }
            broadcast(new NotifEvent("مبروك تقبلت في طريق إللى حبيت علبه", $tab));
            $trajet = trajet::find($modelsRequest->trajet_id);
            if ($trajet->nbplacesCurrent >= $trajet->nbplaces) {
                return response()->json(["data" => "No More Places"], 400);
            } else {
                $diff = $trajet->nbplaces - $trajet->nbplacesCurrent;
                if ($diff >= $request->nbplaces) {
                    $trajet->nbplacesCurrent+= $request->nbplaces;
                    $trajet->save();
                }
                return response()->json(["data" => "User Accepted"], 200);
            }
        } else {
            return response()->json(["data" => "Not Found"], 404);
        }
    }


    public function RejectUser(Request $request)
    {
        $requestedUser = ModelsRequest::where("user_id", $request->user_id)->where("trajet_id", $request->trajet_id)->first();
        if ($requestedUser) {
            $requestedUser->delete();
            $trajet = trajet::find($request->trajet_id);
            $trajet->nbplacesCurrent-=$requestedUser->nbplaces;
            $trajet->save();
            $tab = [];
            $tab[] = [
                'id' =>  $request->user_id
            ];
            $notif = new Notif();
            $notif->user_id = $request->user_id;
            $notif->content = "فيها خير مقبلكش في الطريق متاعو";
            $notif->save();
            broadcast(new NotifEvent("فيها خير مقبلكش في الطريق متاعو", $tab));
            return response()->json(["data" => "User Rejected"], 200);
        } else {
            return response()->json(["data" => "Not Found"], 404);
        }
    }

    public function getRequest(Request $request)
    {
        $requestUser = ModelsRequest::where("user_id", $request->user()->id)->get();
        return response()->json(["data" =>  $requestUser], 200);
    }

    public function SupprimerDeamnde(Request $request, $id)
    {
        $requestUser = ModelsRequest::where("user_id", $request->user()->id)->where("trajet_id", $id)->first();
        if ($requestUser) {
            $requestUser->delete();
            $trajet = trajet::find($id);
            $trajet->nbplacesCurrent-=$requestUser->nbplaces;
            $trajet->save();
            $trajet = Trajet::find($id);
            $tab = [];
            $tab[] = [
                'id' =>  $trajet->user_id
            ];
            $notif = new Notif();
            $notif->user_id = $trajet->user_id;
            $notif->content = "فما شكون خرج";
            $notif->save();
            broadcast(new NotifEvent("فما شكون خرج", $tab));
            return response()->json(["data" =>  $requestUser], 200);
        } else {
            return response()->json(["data" =>  "Not Found"], 404);
        }
    }

    public function CreateAlert(Request $request)
    {
        $ExistAlert = Alert::where('user_id', $request->user()->id)->where('depart', $request->depart)->where('destination', $request->destination)->where('date', $request->date)->first();
        if ($ExistAlert) {
            return response()->json(["data" => "You have already created this alert"], 404);
        }
        $alert = new Alert();
        $alert->depart = $request->depart;
        $alert->destination = $request->destination;
        $alert->date = $request->date;
        $alert->user_id = $request->user()->id;
        $alert->save();
    }
}
