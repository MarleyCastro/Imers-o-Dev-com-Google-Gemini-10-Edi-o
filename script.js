let data = [];

async function iniciarBusca() {
    let resposta = await fetch("data.json");
    data = await resposta.json();
    console.log(data);
}