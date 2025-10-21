<?php

use App\Http\Controllers\StaffViewController;
use App\Http\Controllers\AdminViewController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\SignInController;
use App\Http\Controllers\StaffLoginController;
use App\Http\Controllers\StaffSigninController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public
Route::get('/', fn() => Inertia::render('logger'))->name('login');
Route::get('/logger', fn() => Inertia::render('logger'));
Route::get('StaffPage', fn() => Inertia::render('StaffPage'));


//Admin Controll
Route::post('/users/{id}/promote', [UserController::class, 'promote'])->name('users.promote');
Route::post('/users/{id}/verify', [UserController::class, 'verify'])->name('users.verify');
Route::delete('/users/{id}/delete', [UserController::class, 'delete'])->name('users.delete');
Route::post('/users/{id}/reject', [UserController::class, 'Reject']);
Route::post('activities/generate', [UserController::class, 'GenerateActivity'])->name('activities.generate');
Route::post('/AddProjectAdmin', [AdminViewController::class, 'AddProject']);
Route::post('/update', [HomeController::class, 'update']);
Route::post('/UpdatePrivacy', [HomeController::class, 'UpdatePrivacy']);
Route::post('/projects/{id}/done', [AdminViewController::class, 'SetDone']);
Route::post('/projects/{id}/cancel', [AdminViewController::class, 'Cancel']);
Route::delete('/projects/{id}/delete', [AdminViewController::class, 'delete']);

//StaffControll
  Route::post('/activities/generates', [StaffViewController:: class, 'GenerateActivity']);
    Route::post('/AddProjectStaff', [StaffViewController:: class, 'AddProject']);

 // User Control

Route::post('/activities/select', [HomeController::class, 'selectActivity'])->name('activities.select');
Route::post('submitted/activity/{id}', [UserController::class ,'SubmittedAct'])->name('submitted.activity');
Route::post('JoinProject', [HomeController:: class, 'JoinProject']);
Route::post('/PostData' , [HomeController:: class, 'Posted']);
Route::delete('/post/{id}/delete', [HomeController::class , 'Delete']);

// Protected Staff Controll

Route::middleware(['auth:staff'])->group(function () {
    Route::get('/StaffView', [StaffViewController::class, 'index'])->name('staff.view');
  
    
});

Route::middleware(['auth'])->group(function () {

    Route::get('/HomePage', [HomeController::class, 'index'])->name('home');

    Route::get('/AdminView', [AdminViewController::class, 'index'])->name('admin.view');
   
});



// Auth
Route::post('/staff/login', [StaffLoginController::class, 'login'])->name('staff.login');
Route::post('/StaffSigninController', [StaffSigninController::class, 'store']);
Route::post('/SignInController', [SignInController::class, 'store']);
Route::post('/LoginController', [LoginController::class, 'login']);


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
