// Criando uma funcionalidade de sorteio em JavaScript puro usando um backend simulado com Fetch API e JSON

// Função para realizar o sorteio
function realizarSorteio(nomes) {
  const indexAleatorio = Math.floor(Math.random() * nomes.length);
  return nomes[indexAleatorio];
}

// Simulador de backend com manipulação de eventos
var servidorSimulado = {
  sorteio: (query) => {
      const nomes = query.nomes ? query.nomes.split(',') : [];
      if (nomes.length === 0) {
          return { status: 400, body: { error: 'Por favor, forneça nomes para o sorteio na query string.' } };
      }

      const vencedor = realizarSorteio(nomes);
      return { status: 200, body: { vencedor } };
  }
};

// Simulação de Fetch API
async function fetchSimulado(url) {
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const nomes = urlParams.get('nomes');

  var response = servidorSimulado.sorteio({ nomes });
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve({
              ok: response.status === 200,
              status: response.status,
              json: async () => response.body,
          });
      }, 500);
  });
}

function adicionarCampo() {
    const container = document.querySelector('.outros_nomes_div');
    const novoInput = document.createElement('input');
    const quebraLinha = document.createElement('br');
    
    novoInput.type = 'text';
    novoInput.placeholder = 'Digite um nome';
    novoInput.className = 'inputNomes';
    
    container.appendChild(novoInput);
    container.appendChild(quebraLinha);
}

document.addEventListener('DOMContentLoaded', () => {
    const btnSortear = document.getElementById('btnSortear');
    const resultado = document.getElementById('resultado');

    btnSortear.addEventListener('click', async () => {
        try {
            // Seleciona todos os inputs com a classe 'inputNomes'
            const inputs = document.getElementsByClassName('inputNomes');
            
            // Coleta os valores dos inputs em um array
            const nomes = Array.from(inputs)
                .map(input => input.value.trim()) // Remove espaços extras
                .filter(nome => nome); // Remove inputs vazios
            
            if (nomes.length === 0) {
                resultado.textContent = 'Erro: Por favor, preencha pelo menos um nome.';
                return;
            }
            
            // Envia os nomes para o simulador
            const response = await fetchSimulado(`/sorteio?nomes=${nomes.join(',')}`);
            if (response.ok) {
                const data = await response.json();
                resultado.textContent = `Vencedor: ${data.vencedor}`;
            } else {
                const error = await response.json();
                resultado.textContent = `Erro: ${error.error}`;
            }
        } catch (e) {
            resultado.textContent = 'Erro ao realizar o sorteio.';
        }
    });
});