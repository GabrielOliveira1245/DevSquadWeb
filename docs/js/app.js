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
});
