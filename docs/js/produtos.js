console.log("produtos.js carregado");

export function inicializarProdutoCRUD() {
  console.log("Função inicializarProdutoCRUD executada");

  const form = document.getElementById("produtoForm");
  const lista = document.getElementById("produtosList");
  const botaoSubmit = form.querySelector('button[type="submit"]');
  const apiUrl = "http://localhost:8000/api/produtos";

  let idEmEdicao = null;

  if (!form || !lista) {
    console.warn("Formulário ou lista não encontrados.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      let response;

      if (idEmEdicao) {
        formData.append("_method", "PUT");
        response = await fetch(`${apiUrl}/${idEmEdicao}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao salvar produto.");
        return;
      }

      alert(data.message || "Produto salvo com sucesso!");
      form.reset();
      idEmEdicao = null;
      botaoSubmit.textContent = "Cadastrar Produto";
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Erro ao salvar produto.");
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
          ? `http://localhost:8000/storage/${produto.imagem}`
          : "";

        card.innerHTML = `
          <div class="card h-100">
            ${imagemUrl ? `<img src="${imagemUrl}" class="card-img-top" alt="Imagem do Produto">` : ""}
            <div class="card-body">
              <h5 class="card-title">${produto.nome}</h5>
              <p class="card-text">Preço: R$ ${parseFloat(produto.preco).toFixed(2)}</p>
              <p class="card-text">Pagamento: ${produto.forma_pagamento}</p>
              <p class="card-text">Qtd: ${produto.quantidade}</p>
              <div class="d-flex gap-2">
                <button class="btn btn-warning btn-sm btn-editar" data-id="${produto.id}">Alterar</button>
                <button class="btn btn-danger btn-sm btn-excluir" data-id="${produto.id}">Excluir</button>
              </div>
            </div>
          </div>
        `;

        const botaoExcluir = card.querySelector(".btn-excluir");
        botaoExcluir.addEventListener("click", () => excluirProduto(produto.id));

        const botaoEditar = card.querySelector(".btn-editar");
        botaoEditar.addEventListener("click", () => preencherFormularioParaEdicao(produto));

        lista.appendChild(card);
      });
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      alert("Erro ao carregar produtos.");
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

  function preencherFormularioParaEdicao(produto) {
    idEmEdicao = produto.id;
    form.nome.value = produto.nome;
    form.preco.value = produto.preco;
    form.forma_pagamento.value = produto.forma_pagamento;
    form.quantidade.value = produto.quantidade;
    botaoSubmit.textContent = "Salvar Alterações";
    form.scrollIntoView({ behavior: "smooth" });
  }

  carregarProdutos();
}
