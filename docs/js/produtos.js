console.log("produtos.js carregado");
export function inicializarProdutoCRUD() {
    console.log("Função inicializarProdutoCRUD disponível");
  const form = document.getElementById("produtoForm");
  const lista = document.getElementById("produtosList");
  const apiUrl = "http://127.0.0.1:8000/api/produtos";

  if (!form || !lista) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      alert(data.message || "Produto cadastrado!");
      form.reset();
      carregarProdutos();
    } catch (err) {
      alert("Erro ao cadastrar produto.");
    }
  });

  async function carregarProdutos() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      lista.innerHTML = "";

      data.data.forEach(prod => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";

        card.innerHTML = `
          <div class="card h-100">
            ${prod.imagem_url ? `<img src="${prod.imagem_url}" class="card-img-top">` : ""}
            <div class="card-body">
              <h5 class="card-title">${prod.nome}</h5>
              <p class="card-text">Preço: R$ ${prod.preco}</p>
              <p class="card-text">Pagamento: ${prod.forma_pagamento}</p>
              <p class="card-text">Qtd: ${prod.quantidade}</p>
              <button class="btn btn-danger btn-sm" onclick="excluirProduto(${prod.id})">Excluir</button>
            </div>
          </div>
        `;

        lista.appendChild(card);
      });
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }

  window.excluirProduto = async function (id) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      alert("Produto excluído.");
      carregarProdutos();
    } catch (err) {
      alert("Erro ao excluir produto.");
    }
  };

  carregarProdutos();
}
