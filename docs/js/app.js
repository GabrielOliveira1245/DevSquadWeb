import { inicializarProdutoCRUD } from "./produtos.js";

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a.nav-link");
  const conteudo = document.getElementById("conteudo");

  async function carregarPagina(pagina) {
    try {
      const response = await fetch(pagina);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const novoConteudo = doc.getElementById("conteudo").innerHTML;
      conteudo.innerHTML = novoConteudo;
      window.history.pushState({}, "", pagina);

      // Verifica se é a página de cadastro de produto
      if (doc.getElementById("produtoForm")) {
      inicializarProdutoCRUD();
      }

    } catch (error) {
      conteudo.innerHTML = "<p>Erro ao carregar página.</p>";
    }
  }

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.endsWith(".html")) {
        e.preventDefault();
        carregarPagina(href);
      }
    });
  });

  window.addEventListener("popstate", function () {
    carregarPagina(location.pathname);
  });
});
