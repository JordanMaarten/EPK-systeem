<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Epk;

use Inertia\Inertia;

class TestController extends Controller
{
    public function index() {
        return Inertia::render("TEST/test");
    }

    public function insert() {
        
    }

    public function update() {

    }

}
