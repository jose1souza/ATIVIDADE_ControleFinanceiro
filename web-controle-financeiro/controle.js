const form = document.getElementById('form');
const descInput = document.querySelector('#descricao');
const valorInput = document.querySelector('#montante');
const balancoH1 = document.querySelector('#balanco');
const receitaP = document.querySelector('#din-positivo');
const despesaP = document.querySelector('#din-negativo');
const transacoesUl = document.querySelector('#transacoes');

// Vamos usar o WebStorage para persistir as transações

// Chave de acesso aos dados
const chave_transacoes_ls = 'transacoes';

// Vetor para armazenar as transacoes
let transacoesSalvas;

// Inicializa transacoes salvas
try{
    transacoesSalvas = JSON.parse(localStorage.getItem(chave_transacoes_ls));
} catch (error){
    transacoesSalvas = [];
}

if(transacoesSalvas == null){
    transacoesSalvas = [];
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Recuperar os valores
    const descTransacao = descInput.value.trim();
    const valorTransacao = valorInput.value.trim();

    // Validar os inputs
    if(descTransacao === ""){
        alert("A descrição da transação não pode ser vazia");
        return;
    }
    if(valorTransacao === ""){
        alert("O valor da transação não pode ser vazia");
        return;
    }

    // Criar objeto da transação
    const transacao = {
        id: parseInt(Math.random() * 1000),//arrumar aqui
        descricao: descTransacao,
        valor: parseFloat(valorTransacao)
    };

    somaAoSaldo(transacao);
    somaReceitaDespesa(transacao);
    addTransacaoAoDOM(transacao);

    descInput.value = "";
    valorInput.value = "";
    transacoesSalvas.push(transacao);
    localStorage.setItem(chave_transacoes_ls, JSON.stringify(transacoesSalvas));
}); // Fim addEventListener form 

function somaAoSaldo(transacao){
    const valorTransacao = transacao.valor;

    let total = balancoH1.innerHTML.replace("R$", "");
    total = parseFloat(total);
    total += valorTransacao;

    balancoH1.innerHTML = `R$${total}`;
}

function somaReceitaDespesa(transacao){
    const elementoAlterado = transacao.valor > 0 ? receitaP : despesaP;
    const substituir = transacao.valor > 0 ? "+ R$" : "- R$";

    let valor = elementoAlterado.innerHTML.replace(substituir, "");
    valor = parseFloat(valor);

    const valorTransacao = transacao.valor;
    valor += Math.abs(valorTransacao);

    elementoAlterado.innerHTML = `${substituir}${valor}`;
}

function addTransacaoAoDOM(transacao){
    const sinal = transacao.valor < 0 ? "-" : "";
    const classeCSS = transacao.valor < 0 ? "negativo" : "positivo";

    let valorTransacao = Math.abs(transacao.valor);

    //cria um elemento li
    const li = document.createElement('li');
    
    //adiciona uma classe ao elemento
    li.classList.add(classeCSS);

    li.innerHTML = `${transacao.descricao} 
                    <span>${sinal}R$${valorTransacao}</span>
                    <button class="delete-btn" 
                    onclick="deletaTransacao(${transacao.id})">X</button>`;

    transacoesUl.append(li);
    
}

// Carregar os dados persistidos
function carregarDados(){
    transacoesUl.innerHTML = "";
    balancoH1.innerHTML = "R$0.00";
    receitaP.innerHTML = "+ R$0.00";
    despesaP.innerHTML = "- R$0.00";

    for(let i = 0;i < transacoesSalvas.length; i++){
        somaAoSaldo(transacoesSalvas[i])
        somaReceitaDespesa(transacoesSalvas[i]);
        addTransacaoAoDOM(transacoesSalvas[i]);
    }
}

function deletaTransacao(idTransacao){
    alert(idTransacao);
    const transacaoIndex = transacoesSalvas.findIndex(
        (transacao) => transacao.id == idTransacao
    );

    transacoesSalvas.splice(transacaoIndex, 1);
    
    localStorage.setItem(chave_transacoes_ls, 
        JSON.stringify(transacoesSalvas));
    
    carregarDados();
} //    DEVE SER OTIMIZADOOOOOOOOOOOOOOOO
/*
id não pode ser aleatório, arrumar isso
despesa, não pode ser por valor negativo
ao excluir não deve recarregar
remove no list item apenas, remove
excluir do local storage já tá feita, recalcule

*/

carregarDados();