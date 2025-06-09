<?php

namespace App\Http\Controllers\API;

use App\Models\Produto;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ProdutoResource;
use Illuminate\Support\Facades\Validator;

class ProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produtos = Produto::all();
        return response([
            'data' => $produtos,
            'message' => 'Produtos recuperados com sucesso'
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric',
            'forma_pagamento' => 'required|string|max:100',
            'quantidade' => 'required|integer|min:1',
            'imagem' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response([
                'error' => $validator->errors(),
                'message' => 'Erro de validação'
            ], 400);
        }

        $imagemPath = null;

        if ($request->hasFile('imagem')) {
            $nomeImagem = time() . '_' . $request->file('imagem')->getClientOriginalName();
            $imagemPath = $request->file('imagem')->storeAs('produtos', $nomeImagem, 'public');
        }

        $data['imagem'] = $imagemPath;

        $produto = Produto::create($data);

        return response([
            'data' => $produto,
            'message' => 'Produto criado com sucesso'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Produto $produto)
    {
        return response([
            'data' => $produto,
            'message' => 'Produto recuperado com sucesso'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Produto $produto)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric',
            'forma_pagamento' => 'required|string|max:100',
            'quantidade' => 'required|integer|min:1',
            'imagem' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response([
                'error' => $validator->errors(),
                'message' => 'Erro de validação'
            ], 400);
        }

        if ($request->hasFile('imagem')) {
            $nomeImagem = time() . '_' . $request->file('imagem')->getClientOriginalName();
            $data['imagem'] = $request->file('imagem')->storeAs('produtos', $nomeImagem, 'public');
        }

        $produto->update($data);

        return response([
            'data' => $produto,
            'message' => 'Produto atualizado com sucesso'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produto $produto)
    {
        $produto->delete();

        return response(['message' => 'Produto deletado com sucesso']);
    }
}
