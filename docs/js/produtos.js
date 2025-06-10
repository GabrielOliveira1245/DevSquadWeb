console.log("produtos.js carregado");

export function inicializarProdutoCRUD() {
  console.log("Função inicializarProdutoCRUD executada");

  const form = document.getElementById("produtoForm");
  const lista = document.getElementById("produtosList");
  const apiUrl = "http://localhost:8000/api/produtos"; // ajuste se necessário

  if (!form || !lista) {
    console.warn("Formulário ou lista não encontrados.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao cadastrar produto.");
        return;
      }

      alert(data.message || "Produto cadastrado com sucesso!");
      form.reset();
      
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      alert("Erro ao cadastrar produto.");
    }
  });

  async function carregarProdutos() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      lista.innerHTML = "";

      data.data.forEach((produto) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";

        const imagemUrl = produto.imagem
      


        card.innerHTML = `
          <div class="card h-100">
            ${imagemUrl ? `<img src="${imagemUrl}" class="card-img-top" alt="Imagem do Produto">` : ""}
            <div class="card-body">
              <h5 class="card-title">${produto.nome}</h5>
              <p class="card-text">Preço: R$ ${parseFloat(produto.preco).toFixed(2)}</p>
              <p class="card-text">Pagamento: ${produto.forma_pagamento}</p>
              <p class="card-text">Qtd: ${produto.quantidade}</p>
              <button class="btn btn-danger btn-sm" data-id="${produto.id}">Excluir</button>
            </div>
          </div>
        `;

        const botaoExcluir = card.querySelector("button");
        botaoExcluir.addEventListener("click", () => excluirProduto(produto.id));

        lista.appendChild(card);
      });
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      alert("123.");
    }
  }

  async function excluirProduto(id) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      alert(data.message || "Produto excluído.");
      
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Erro ao excluir produto.");
    }
  }

  carregarProdutos();
}
