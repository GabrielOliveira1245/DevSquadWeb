<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProdutoController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/produto', [ProdutoController::class, 'cadastroproduto']);