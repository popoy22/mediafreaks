<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return array(
            "employees" => User::orderBy('id','desc')->get() 
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $user = User::firstOrCreate(
            ['email' => $data['email']],
            [
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'gender' => $data['gender'],
            'address' => $data['address'],
            'admin' => $data['admin'],
            'birthdate' => date("Y-m-d",strtotime($data['birthdate'])),
            'password' => Hash::make("password"),
        ]);
        return array("user" => $user , "created" => $user->wasRecentlyCreated);
     }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        return array(
            "employee" => User::find($id)
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->all();
        
        if(!isset($data['password'])){

            $validator = Validator::make($request->all(), [
                'email' => 'unique:users,email,'.$id
            ]);
            if ($validator->fails()) {
                return array("message" => "E-mail is already in used by other employee" );
            }
            
            $arr = [
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'phone' => $data['phone'],
                'gender' => $data['gender'],
                'admin' => intval($data['admin']),
                'address' => $data['address'],
                'email' => $data['email'],
                'birthdate' => date("Y-m-d",strtotime($data['birthdate'])),
            ];
        }else{
            $arr['password'] =  Hash::make($data['password']);
        }
        $user = User::where('id',$id)->update($arr);
        return array("user" => $user );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        User::find($id)->delete();
        return array("message" => "deleted");
    }


    public function login(Request $request){
        
        $validatedData =  $request->validate([
            'email' => 'email|required',
            'password' => 'required'
        ]);
        
        if(!auth()->attempt($validatedData)){
            return ['message' => 'Invalid Credentials'];
        }else{
            $accessToken = auth()->user()->createToken('authToken')->accessToken;
            return ['user' => auth()->user(),'access_token' => $accessToken ];
        }
    }


}