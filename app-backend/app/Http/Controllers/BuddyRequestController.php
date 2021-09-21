<?php

namespace App\Http\Controllers;

use App\Models\Buddy;
use App\Models\BuddyRequest;
use Illuminate\Http\Request;

class BuddyRequestController extends Controller
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
        //
        error_log($request);
        $buddyReq=new BuddyRequest();
        //reciever id
        $buddyReq->userID = $request->userID;
        //sender id
        $buddyReq->buddyID = $request->buddyID;
        $buddyReq->status = "pending";
        return $buddyReq->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\BuddyRequest  $buddyRequest
     * @return \Illuminate\Http\Response
     */
    public function show(BuddyRequest $buddyRequest)
    {
        //
        return $buddyRequest->toJson();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\BuddyRequest  $buddyRequest
     * @return \Illuminate\Http\Response
     */
    public function edit(BuddyRequest $buddyRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\BuddyRequest  $buddyRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BuddyRequest $buddyRequest)
    {
        //
        $buddyRequest->userID = $request->userID;
        $buddyRequest->buddyID = $request->buddyID;
        $buddyRequest->status = $request->status;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\BuddyRequest  $buddyRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(BuddyRequest $buddyRequest)
    {
        //
        return $buddyRequest->delete();
    }
    
}