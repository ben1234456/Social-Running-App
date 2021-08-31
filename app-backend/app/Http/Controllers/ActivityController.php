<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;


class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        error_log($request);

        $activity = new Activity;

        $activity->activity_type = "walking";
        $activity->route_id = 1;
        $activity->start_lat = floatval($request->start_lat);
        $activity->start_lng = floatval($request->start_lng);
        $activity->end_lat = floatval($request->end_lat);
        $activity->end_lng = floatval($request->end_lng);
        $activity->highest_altitude = 0;
        $activity->total_distance = floatval($request->total_distance);

        $activity->save();

        $useractivity = new UserActivity;
        $useractivity->user_id = $request->user_ID;
        $latest = DB::table('activities')->order_by('id', 'desc')->first();
        $useractivity->activity_id = $latest->id;
        $useractivity->save();

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function show(Activity $activity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function edit(Activity $activity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Activity $activity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Activity  $activity
     * @return \Illuminate\Http\Response
     */
    public function destroy(Activity $activity)
    {
        //
    }

    public function showUserActivities(Request $request, User $user)
    {

        $activities = DB::table('user_activities')->OrderBy('id', 'desc')->where('user_id', $user->id)->get();

        $arr = array();

        foreach($activities as $activity){
            array_push($arr, $activity->activity_id);
        }

        $useractivities = DB::table('activities')->OrderBy('id', 'desc')->whereIn('id', $arr)->take(3)->get();

        return $useractivities->toJson();
    }

    public function showAllUserActivities(Request $request, User $user)
    {

        $activities = DB::table('user_activities')->OrderBy('id', 'desc')->where('user_id', $user->id)->get();

        $arr = array();

        foreach($activities as $activity){
            array_push($arr, $activity->activity_id);
        }

        $useractivities = DB::table('activities')->OrderBy('id', 'desc')->whereIn('id', $arr)->get();

        return $useractivities->toJson();
    }
}
