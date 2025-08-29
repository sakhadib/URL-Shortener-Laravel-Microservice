<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $r) {
        $data = $r->validate([
            'name'=>'required|string|max:120',
            'email'=>'required|email|unique:users,email',
            'password'=>['required', Password::min(6)]
        ]);
        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>Hash::make($data['password']),
        ]);
        $token = JWTAuth::fromUser($user);
        return response()->json(['access_token'=>$token, 'token_type'=>'bearer']);
    }

    public function login(Request $r) {
        $cred = $r->only('email','password');
        if (!$token = auth('api')->attempt($cred)) {
            return response()->json(['message'=>'Invalid credentials'], 401);
        }
        return response()->json(['access_token'=>$token, 'token_type'=>'bearer']);
    }

    public function refresh() {
        return response()->json(['access_token'=>JWTAuth::refresh(), 'token_type'=>'bearer']);
    }

    public function me() {
        return response()->json(auth('api')->user());
    }
}
