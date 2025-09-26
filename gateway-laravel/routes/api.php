<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\GatewayAuthController;
use App\Http\Controllers\GatewayLinksController;
use App\Http\Controllers\RedirectController;

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

// Auth (pass-through)
Route::post('/auth/register', [GatewayAuthController::class,'register']);
Route::post('/auth/login',    [GatewayAuthController::class,'login']);
Route::post('/auth/refresh',  [GatewayAuthController::class,'refresh']);
Route::get('/me',             [GatewayAuthController::class,'me'])->middleware('jwtuser');

// Links (needs JWT)
Route::middleware('jwtuser')->group(function () {
  Route::post('/links',          [GatewayLinksController::class,'create']);
  Route::get('/links',           [GatewayLinksController::class,'list']);
  Route::get('/links/{code}',    [GatewayLinksController::class,'detail']);
  Route::delete('/links/{id}',   [GatewayLinksController::class,'destroy']);
  Route::get('/dashboard/stats', [GatewayLinksController::class,'dashboardStats']);
});

// Public redirect
Route::get('/r/{code}', [RedirectController::class,'go']);
Route::post('/r/{code}/track', [RedirectController::class,'track']);