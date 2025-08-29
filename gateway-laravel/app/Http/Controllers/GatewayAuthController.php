<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GatewayAuthController extends Controller
{
    public function register(Request $r) {
        $res = Http::post(env('IDENTITY_URL').'/api/auth/register', $r->all());
        return response($res->body(), $res->status());
    }
    public function login(Request $r) {
        $res = Http::post(env('IDENTITY_URL').'/api/auth/login', $r->all());
        return response($res->body(), $res->status());
    }
    public function refresh(Request $r) {
        $res = Http::withToken($r->bearerToken())->post(env('IDENTITY_URL').'/api/auth/refresh');
        return response($res->body(), $res->status());
    }
    public function me(Request $r) {
        $res = Http::withToken($r->bearerToken())->get(env('IDENTITY_URL').'/api/me');
        return response($res->body(), $res->status());
    }
}
