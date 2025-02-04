<?php

namespace App\Http\Controllers;

use App\Models\Band;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BandSearchController extends Controller
{
    public function index(Band $band) {
        return Inertia::render('BandSearch', ['bands' => compact('band')]); 
    }
}
