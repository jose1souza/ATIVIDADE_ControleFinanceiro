const form = document.getElementById('form');
const descImput = document.querySelector('#descricao');
const valorImput = document.querySelector('#montante');
const balancoH1 = document.querySelector('#balanco');
const receitaP = document.querySelector('#din-positivo');
const despesaP = document.querySelector('#din-negativo');
const botaoReceita = document.getElementById("btn-receita");
const botaoDespesa = document.getElementById("btn-despesa");
const transacoesUl = document.querySelector('#transacoes');
let proximoId = 0;

// Vamos usar o WebStorage para persistir as transações
// Chave de acesso aos dados
const chave_transacoes_ls = 'transacoes';

// Vetor para armazenar as transações
let transacoesSalvas = null;

// Inicializa transações salvas
try {
    transacoesSalvas = JSON.parse(localStorage.getItem(chave_transacoes_ls));
} catch (error) {
    transacoesSalvas = [];
}

if (transacoesSalvas == null) {
    transacoesSalvas = [];
}

botaoReceita.addEventListener("click", (event) => {
    event.preventDefault();
    adicionarTransacao("receita");
});

botaoDespesa.addEventListener("click", (event) => {
    event.preventDefault();
    adicionarTransacao("despesa");
});

function adicionarTransacao(tipo) {
    const descTransacao = descImput.value.trim();
    const valorTransacao = valorImput.value.trim();

    // Validar os imputs
    if (descTransacao === "") {
        alert("A descrição da transação não pode ser vazia.");
        return;
    }
    if (valorTransacao === "") {
        alert("O valor da transação não pode ser vazio.");
        return;
    }

    const valorFinal = tipo === "receita"
        ? parseFloat(valorTransacao)
        : -parseFloat(valorTransacao);

    const transacao = {
        id: proximoId,
        descricao: descTransacao,
        valor: valorFinal
    };
    proximoId++;

    somaAoSaldo(transacao);
    somaReceitaDespesa(transacao);
    addTransacaoAoDOM(transacao);

    descImput.value = "";
    valorImput.value = "";

    transacoesSalvas.push(transacao);
    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));
}

// Métodos auxiliares
function somaAoSaldo(transacao) {
    const valorTransacao = transacao.valor;

    let total = balancoH1.innerHTML.replace("R$", "");
    total = parseFloat(total);
    total += valorTransacao;

    balancoH1.innerHTML = `R$${total}`;
}

function somaReceitaDespesa(transacao) {
    const elementoAlterado = transacao.valor > 0 ? receitaP : despesaP;
    const substituir = transacao.valor > 0 ? "+ R$" : "- R$";

    let valor = elementoAlterado.innerHTML.replace(substituir, "");
    valor = parseFloat(valor);

    const valorTransacao = transacao.valor;
    valor += Math.abs(valorTransacao);

    elementoAlterado.innerHTML = `${substituir}${valor}`;
}

function addTransacaoAoDOM(transacao) {
    const sinal = transacao.valor < 0 ? "-" : "";
    const classeCSS = negativoOrPositivo(transacao)

    let valorTransacao = Math.abs(transacao.valor);
    const li = document.createElement('li');
    li.classList.add(classeCSS);
    li.innerHTML = `${transacao.descricao} 
                    <span>${sinal}R$${valorTransacao}</span>
                    <button class="delete-btn" 
                    onclick="deletaTransacao(${transacao.id})">X</button>`;

    transacoesUl.append(li);
}

function negativoOrPositivo(transacao) {
    return transacao.valor < 0 ? "negativo" : "positivo";
}

// Carregar os dados persistidos
function carregarDados() {
    transacoesUl.innerHTML = "";
    balancoH1.innerHTML = "R$0.00";
    receitaP.innerHTML = "+ R$0.00";
    despesaP.innerHTML = "- R$0.00";

    for (let i = 0; i < transacoesSalvas.length; i++) {
        somaAoSaldo(transacoesSalvas[i]);
        somaReceitaDespesa(transacoesSalvas[i]);
        addTransacaoAoDOM(transacoesSalvas[i]);
    }
}

function deletaTransacao(idTransacao) {
    const transacaoIndex = transacoesSalvas.findIndex(
        transacao => transacao.id == idTransacao
    );
    const transacaoRemovida = transacoesSalvas[transacaoIndex];

    // Remove do vetor
    transacoesSalvas.splice(transacaoIndex, 1);
    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));

    // Remove o li correspondente
    const li = document.querySelector(`button[onclick="deletaTransacao(${idTransacao})"]`).parentElement;
    li.remove();

    // Atualiza saldo
    let total = parseFloat(balancoH1.innerHTML.replace("R$", ""));
    total -= transacaoRemovida.valor;
    balancoH1.innerHTML = `R$${total}`;

    // Atualiza receita ou despesa
    if (transacaoRemovida.valor > 0) {
        let receita = parseFloat(receitaP.innerHTML.replace("+ R$", ""));
        receita -= transacaoRemovida.valor;
        receitaP.innerHTML = `+ R$${receita}`;
    } else {
        let despesa = parseFloat(despesaP.innerHTML.replace("- R$", ""));
        despesa -= Math.abs(transacaoRemovida.valor);
        despesaP.innerHTML = `- R$${despesa}`;
    }
}

carregarDados();