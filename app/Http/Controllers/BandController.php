<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BandController extends Controller
{
    public function show() {
        return Inertia::render('Bands'); 
    }
}
