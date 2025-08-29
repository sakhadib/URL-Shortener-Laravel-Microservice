<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LinksController;

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
  Route::post('/internal/links',                 [LinksController::class, 'create']);
  Route::get('/internal/links',                  [LinksController::class, 'listByOwner']);
  Route::get('/internal/links/{id}',             [LinksController::class, 'show']);
  Route::get('/internal/links/by-code/{code}',   [LinksController::class, 'byCode']);
  Route::delete('/internal/links/{id}',          [LinksController::class, 'destroy']);
});
