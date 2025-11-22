let cardContainer = document.querySelector("main");
let campoBusca = document.querySelector("#campo-busca");
let botaoBusca = document.querySelector("#botao-busca");
const themeToggleButton = document.querySelector("#theme-toggle-button");
const body = document.body;

// Elementos do Modal
const modalOverlay = document.querySelector("#modal-overlay");
const modalCloseBtn = document.querySelector("#modal-close-btn");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalPrice = document.querySelector("#modal-price");
const btnSaibaMais = document.querySelector("#btn-saiba-mais");
const btnTenhoInteresse = document.querySelector("#btn-tenho-interesse");

let dados = [];
let veiculoAtual = null;

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (error) {
        console.error("Falha ao carregar dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar os veículos. Tente novamente mais tarde.</p>";
    }
}

function filtrarDados() {
    const termoBusca = campoBusca.value.toLowerCase().trim();

    if (!termoBusca) {
        renderizarCards(dados);
        return;
    }

    const dadosFiltrados = dados.filter(dado => {
        const nome = dado.nome.toLowerCase();
        const descricao = dado.descricao.toLowerCase();
        const valor = dado.valor.toLowerCase();
        return nome.includes(termoBusca) ||
            descricao.includes(termoBusca) ||
            valor.includes(termoBusca);
    });

    if (dadosFiltrados.length === 0) {
        cardContainer.innerHTML = "<p style='text-align: center; padding: 2rem; color: var(--tertiary-color);'>🔍 Nenhum veículo encontrado com esse termo.</p>";
    } else {
        renderizarCards(dadosFiltrados);
    }
}

function renderizarCards(dados) {
    cardContainer.innerHTML = "";

    for (let dado of dados) {
        let article = document.createElement("article");
        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p class="card-description">${dado.descricao.substring(0, 150)}...</p>
            <p><strong>Valor:</strong> ${dado.valor}</p>
            <button class="saiba-mais-btn">Ver Detalhes</button>`;

        article.querySelector('.saiba-mais-btn').addEventListener('click', () => {
            abrirModal(dado);
        });

        cardContainer.appendChild(article);
    }
}

// ==================== FUNÇÕES DO MODAL ====================

function abrirModal(dado) {
    veiculoAtual = dado;

    // Preenche os dados no modal
    modalImage.src = dado.imagem;
    modalImage.alt = `Imagem de ${dado.nome}`;
    modalTitle.textContent = dado.nome;
    modalDescription.textContent = dado.descricao;
    modalPrice.textContent = dado.valor;

    // Abre o modal com animação
    modalOverlay.style.display = 'flex';

    // Pequeno delay para a animação funcionar
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);

    // Previne scroll do body quando modal está aberto
    body.style.overflow = 'hidden';
}

function fecharModal() {
    modalOverlay.classList.remove('active');

    // Aguarda a animação terminar antes de esconder
    setTimeout(() => {
        modalOverlay.style.display = 'none';
        veiculoAtual = null;
    }, 300);

    // Restaura o scroll do body
    body.style.overflow = 'auto';
}

function saibaMais() {
    if (veiculoAtual) {
        alert(`📱 Entre em contato para saber mais sobre:\n\n${veiculoAtual.nome}\n\nTelefone: (11) 9999-9999\nWhatsApp: (11) 9999-9999\nE-mail: contato@veiculos.com`);
    }
}

function tenhoInteresse() {
    if (veiculoAtual) {
        const mensagem = `Olá! Tenho interesse no veículo:\n\n${veiculoAtual.nome}\nValor: ${veiculoAtual.valor}\n\nGostaria de mais informações.`;

        // Abre WhatsApp (substitua o número pelo seu)
        const numeroWhatsApp = '5511999999999'; // Formato: código país + DDD + número
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, '_blank');
    }
}

function escuroClaro() {
    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
        localStorage.setItem("tema", "light");
    } else {
        localStorage.setItem("tema", "dark");
    }
}

function carregarTema() {
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "light") {
        body.classList.add("light-mode");
    }
}

// ==================== EVENT LISTENERS ====================

// Botão de busca
botaoBusca.addEventListener("click", filtrarDados);

// Enter no campo de busca
campoBusca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        filtrarDados();
    }
});

// Botão de tema
themeToggleButton.addEventListener("click", escuroClaro);

// Limpa busca automaticamente
campoBusca.addEventListener("input", () => {
    if (campoBusca.value.trim() === "") {
        renderizarCards(dados);
    }
});

// Event listeners do Modal
modalCloseBtn.addEventListener("click", fecharModal);

// Fecha modal clicando fora dele
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        fecharModal();
    }
});

// Fecha modal com tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains('active')) {
        fecharModal();
    }
});

// Botões de ação do modal
btnSaibaMais.addEventListener("click", saibaMais);
btnTenhoInteresse.addEventListener("click", tenhoInteresse);

// ==================== INICIALIZAÇÃO ====================

carregarTema();
carregarDados();