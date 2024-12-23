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

// document.getElementById('btnSortear').addEventListener('click', () => {
//   const inputNomes = document.getElementById('inputNomes').value;
//   const resultado = document.getElementById('resultado');

//   try {
//       const response = fetchSimulado(`/sorteio?nomes=${inputNomes}`);
//       if (response.ok) {
//           const data = response.json();
//           resultado.textContent = `Vencedor: ${data.vencedor}`;
//       } else {
//           const error = response.json();
//           resultado.textContent = `Erro: ${error.error}`;
//       }
//   } catch (e) {
//       resultado.textContent = 'Erro ao realizar o sorteio.';
//   }
// });

    document.addEventListener('DOMContentLoaded', () => {
        const inputNomes = document.getElementById('inputNomes');
        const btnSortear = document.getElementById('btnSortear');
        const resultado = document.getElementById('resultado');

        btnSortear.addEventListener('click', async () => {
            try {
                const response = await fetchSimulado(`/sorteio?nomes=${inputNomes.value}`);
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