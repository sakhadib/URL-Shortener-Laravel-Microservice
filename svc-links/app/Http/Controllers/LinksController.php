<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LinksController extends Controller
{
    public function create(Request $r) {
        $data = $r->validate([
            'owner_id' => 'required|integer',
            'target_url' => 'required|url',
            'custom_code' => 'nullable|alpha_num|max:20'
        ]);
        $code = $data['custom_code'] ?? Str::random(8);
        if (Link::where('code',$code)->exists()) {
            return response()->json(['message'=>'Code taken'], 409);
        }
        $link = Link::create([
            'owner_id'=>$data['owner_id'],
            'target_url'=>$data['target_url'],
            'code'=>$code,
        ]);
        return response()->json($link, 201);
    }

    public function listByOwner(Request $r) {
        $ownerId = $r->validate(['owner_id'=>'required|integer'])['owner_id'];
        return Link::where('owner_id',$ownerId)->latest()->paginate(20);
    }

    public function show($id) {
        return Link::findOrFail($id);
    }

    public function byCode($code) {
        $link = Link::where('code',$code)->first();
        if (!$link || !$link->is_active) return response()->json(['message'=>'Not found'], 404);
        return $link;
    }

    public function destroy($id) {
        $link = Link::findOrFail($id);
        $link->is_active = false;
        $link->save();
        return response()->json(['ok'=>true]);
    }
}
