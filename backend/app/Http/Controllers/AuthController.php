<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function Register(Request $request)
    {
        $user = new User();
        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->LinkFacebook = $request->LinkFacebook;
        $user->role = $request->role;
        $user->save();

        $token = $user->createToken("api_token")->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response()->json($response, 201);
    }

    public function UpdateUser(Request $request)
    {
        User::where('id', '=', $request->user()->id)->update(["welcome" => true]);
        return response()->json(['message' => 'User Updated'], 200);
    }


    public function getUser(Request $request)
    {
        $user = User::with('trajet')->where('id', '=', $request->user()->id)->get();
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
}
