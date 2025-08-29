<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\StatsController;

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

Route::middleware('internal')->group(function () {
  Route::post('/internal/events/click',           [StatsController::class, 'click']);
  Route::get('/internal/stats/{code}/summary',    [StatsController::class, 'summary']);
  Route::get('/internal/stats/{code}/daily',      [StatsController::class, 'daily']);
});