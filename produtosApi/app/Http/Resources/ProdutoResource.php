<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProdutoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id'              => $this->id,
            'nome'            => $this->nome,
            'preco'           => number_format($this->preco, 2, ',', '.'),
            'forma_pagamento' => $this->forma_pagamento,
            'quantidade'      => $this->quantidade,
            'imagem_url'      => $this->imagem 
                ? asset('storage/' . $this->imagem) 
                : null,
            'criado_em'       => $this->created_at->format('d/m/Y H:i'),
            'atualizado_em'   => $this->updated_at->format('d/m/Y H:i'),
        ];
    }
}
