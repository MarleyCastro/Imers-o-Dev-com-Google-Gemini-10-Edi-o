let cardContainer = document.querySelector("main");
let campoBusca = document.querySelector("div input");
let botaoBusca = document.querySelector("#botao-busca");
let dados = [];

async function carregarDados() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
}

function filtrarDados() {
    const termoBusca = campoBusca.value.toLowerCase();
    if (!termoBusca) {
        cardContainer.innerHTML = ""; // Limpa os resultados se a busca estiver vazia
        return;
    }

    const dadosFiltrados = dados.filter(dado => {
        const nome = dado.nome.toLowerCase();
        const descricao = dado.descricao.toLowerCase();
        return nome.includes(termoBusca) || descricao.includes(termoBusca);
    });
    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    for (let dado of dados) {
        let article = document.createElement("article");
        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p>${dado.descricao}</p>
            <p><strong>Ano de criação:</strong> ${dado.data_criacao}</p>
            <a href="${dado.link}" target="_blank">Saiba mais</a>`;

        cardContainer.appendChild(article);
    }
}

// Adiciona os "escutadores" de eventos
botaoBusca.addEventListener("click", filtrarDados);

// Inicia o carregamento dos dados quando a página é carregada
carregarDados();