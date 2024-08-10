<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TrajetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'Register']);
});


Route::group(['prefix' => 'trajets'], function () {
    Route::get('/FilterTrajet', [TrajetController::class, 'FilterTrajet']);
});

Route::middleware("auth:sanctum")->group(function () {

    Route::group(['prefix' => 'trajets'], function () {
        Route::post('/add', [TrajetController::class, 'AddTrajet']);
        Route::post('/ReserverTrajet', [TrajetController::class, 'ReserverTrajet']);
        Route::get('/getTrajets', [TrajetController::class, 'getTrajets']);
        Route::get('/getTrajetAccepted', [TrajetController::class, 'getTrajetAccepted']);
        Route::put('/AccepterUser', [TrajetController::class, 'AccepterUser']);
        Route::delete('/RejectUser', [TrajetController::class, 'RejectUser']);
        Route::get("/getRequest",[TrajetController::class,'getRequest']);
        Route::delete("/SupprimerDeamnde/{id}",[TrajetController::class,'SupprimerDeamnde']);
        Route::delete("/deleteTrajet/{id}",[TrajetController::class,'deleteTrajet']);
    });

    Route::group(['prefix' => 'notif'], function () {
        Route::get('/getLatstNotif', [TrajetController::class, 'getLatstNotif']);
        Route::delete('/DeleteAllNotif', [TrajetController::class, 'DeleteAllNotif']);
    });

    Route::group(['prefix' => 'Alert'], function () {
        Route::post('/CreateAlert', [TrajetController::class, 'CreateAlert']);
    });

    Route::group(['prefix' => 'auth'], function () {
        Route::get('/user', [AuthController::class, 'getUser']);
        Route::put('/UpdateUser', [AuthController::class, 'UpdateUser']);
    });

});
