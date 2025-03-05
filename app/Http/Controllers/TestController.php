<?php

namespace App\Http\Controllers;

use App\Models\Epk;
use App\Models\BandMember;
use App\Models\Test;
use Illuminate\Http\Request;
use DOMDocument;

use Inertia\Inertia;

class TestController extends Controller
{
    public function index(Request $request) {
        $test_id = '1';

        if ($request->post('epk_id')) {
            $epk = Epk::where('id', $request->post('epk_id'))->get()->first();
            $band_id = $epk->band_id;

            $user_id = $request->user()->id;

            $band_members = BandMember::where('band_id', $band_id)->get();
            if ($band_members->contains('member_id', $user_id)) 
            {
                return Inertia::render("TEST/EPKEditConcept", $epk->html_data);
            } else
            {
                echo "You are not authorized to view this page... <a href='/'>go back</a>";
                // return redirect()->route('dashboard'); // placeholder route
            }
        } else if (isset($test_id)) {
            $epk = Epk::where('id', $test_id)->get()->first();
            $band_id = $epk->band_id;

            $user_id = $request->user()->id;

            $band_members = BandMember::where('band_id', $band_id)->get();
            if ($band_members->contains('member_id', $user_id)) 
            {
                return Inertia::render("TEST/EPKEditConcept", [
                    "saved_data" => $epk->html_data,
                    "epk_id" => $test_id
                ]);
            } else
            {
                echo "You are not authorized to view this page... <a href='/'>go back</a>";
                // return redirect()->route('dashboard'); // placeholder route
            }
        }
    }

    public function store(Request $request) {
        $html = $request->post('data');

        $doc = new DOMDocument();

        // load the HTML string we want to strip
        $doc->loadHTML($html);

        // get all the script tags
        $script_tags = $doc->getElementsByTagName('script');

        // for each tag, remove it from the DOM
        for ($i = 0; $i < $script_tags->length; $i++) {
        $script_tags->item($i)->parentNode->removeChild($script_tags->item($i));
        }

        // get the HTML string back
        $no_script_html_string = $doc->saveHTML();


        $epk = Epk::where('id', $request->post('epk_id'))->get()->first();

        $band_members = BandMember::where('band_id', $epk->band_id)->get();

        $user_id = $request->user()->id;
        
        if ($band_members->contains('member_id', $user_id)) 
        {
            $epk->html_data = $no_script_html_string;
            $epk->save();
        }
    }
}
