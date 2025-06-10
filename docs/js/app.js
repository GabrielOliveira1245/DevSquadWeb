document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a.nav-link");
  const conteudo = document.getElementById("conteudo");

  if (!conteudo) {
    console.error("Elemento com id 'conteudo' não encontrado.");
    return;
  }

  async function carregarPagina(pagina) {
    try {
      const response = await fetch(pagina);
      if (!response.ok) throw new Error("Falha ao carregar " + pagina);

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const novoConteudoEl = doc.getElementById("conteudo");
      if (!novoConteudoEl) {
        conteudo.innerHTML = "<p>Conteúdo não encontrado na página.</p>";
        return;
      }

      conteudo.innerHTML = novoConteudoEl.innerHTML;
      window.history.pushState({}, "", pagina);

      // Se a nova página contém o formulário de produto, carrega o módulo dinamicamente
      if (conteudo.querySelector("#produtoForm")) {
        const { inicializarProdutoCRUD } = await import("./produtos.js");
        inicializarProdutoCRUD();
      }

      // Se a nova página contém a seção de destaques, carrega os produtos em destaque
      if (conteudo.querySelector("#destaquesContainer")) {
        carregarDestaques();
      }

    } catch (error) {
      console.error("Erro ao carregar página:", error);
      conteudo.innerHTML = "<p>Erro ao carregar página.</p>";
    }
  }

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.endsWith(".html")) {
        e.preventDefault();
        carregarPagina(href);
      }
    });
  });

  window.addEventListener("popstate", function () {
    const caminho = window.location.pathname.split("/").pop() || "index.html";
    carregarPagina(caminho);
  });

  // Carrega a página inicial se for acessada diretamente
  const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
  carregarPagina(paginaAtual);

  // Função para carregar os destaques
  async function carregarDestaques() {
    const container = document.getElementById("destaquesContainer");
    if (!container) return;

    try {
      const response = await fetch("http://localhost:8000/api/produtos");
      const data = await response.json();
      const produtos = data.data.slice(0, 3); // Pega os 3 primeiros

      container.innerHTML = "";

      produtos.forEach(produto => {
        const imagem = produto.imagem_url ?? 'images/placeholder.jpg';
        const preco = parseFloat(produto.preco).toFixed(2).replace(".", ",");

        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
          <a href="produtos.html" class="text-decoration-none text-dark">
            <div class="card h-100">
              <img src="${imagem}" class="card-img-top" alt="${produto.nome}">
              <div class="card-body">
                <h5 class="card-title">${produto.nome}</h5>
                <p class="card-text">R$ ${preco}</p>
              </div>
            </div>
          </a>
        `;
        container.appendChild(card);
      });
    } catch (err) {
      console.error("Erro ao carregar destaques:", err);
      container.innerHTML = `<p class="text-danger text-center">Erro ao carregar produtos em destaque.</p>`;
    }
  }
});
