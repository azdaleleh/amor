const musica = document.getElementById('musica');
const imagemEl = document.getElementById('imagem');
const brilhinhosContainer = document.getElementById('brilhinhos');
const letraEl = document.getElementById('letra');

const telaInicial = document.getElementById('tela-inicial');
const btnComecar = document.getElementById('btnComecar');
const conteudo = document.getElementById('conteudo');

const cartinha = document.getElementById('cartinha');
const modalCarta = document.getElementById('modalCarta');
const btnFecharModal = modalCarta.querySelector('.fechar');

let cenaAtual = 0;
let timeoutId = null;

// Agora temos 8 imagens, com tempos iniciais
const cenas = [
  { imagem: "assets/img1.png", tempo: 2 },
  { imagem: "assets/img2.png", tempo: 8 },
  { imagem: "assets/img3.png", tempo: 15 },
  { imagem: "assets/img4.png", tempo: 21 },
  { imagem: "assets/img5.png", tempo: 27 },
  { imagem: "assets/img6.png", tempo: 33 },
  { imagem: "assets/img7.png", tempo: 39 },
  { imagem: "assets/img8.png", tempo: 45 }
];

// Letras sincronizadas por estrofe com intervalo de segundos
const letras = [
  {
    inicio: 18,
    fim: 28,
    texto: `Você é assim
Um sonho pra mim
E quando eu não te vejo
Eu penso em você`
  },
  {
    inicio: 28,
    fim: 42,
    texto: `Desde o amanhecer
Até quando eu me deito
Eu gosto de você
E gosto de ficar com você`
  },
  {
    inicio: 42,
    fim: 53,
    texto: `Meu riso é tão feliz contigo
O meu melhor amigo
É o meu amor
E a gente canta`
  },
  {
    inicio: 54,
    fim: 60,
    texto: `E a gente dança
E a gente não se cansa
De ser criança`
  }
];

// Criar brilhinhos
function criarBrilhinhos() {
  const num = 30;
  for (let i = 0; i < num; i++) {
    const brilho = document.createElement('div');
    brilho.classList.add('brilhinho');
    resetBrilhinho(brilho);
    brilhinhosContainer.appendChild(brilho);
    brilho.style.animationDuration = (3 + Math.random() * 4) + 's';
    brilho.style.left = Math.random() * 100 + 'vw';
    brilho.style.width = brilho.style.height = (5 + Math.random() * 8) + 'px';
    brilho.addEventListener('animationiteration', () => resetBrilhinho(brilho));
  }
}

function resetBrilhinho(brilho) {
  brilho.style.top = '-10px';
  brilho.style.left = Math.random() * 100 + 'vw';
  brilho.style.opacity = 0.8;
  brilho.style.width = brilho.style.height = (5 + Math.random() * 8) + 'px';
  brilho.style.animationDuration = (3 + Math.random() * 4) + 's';
}

criarBrilhinhos();

// Mostrar imagem com fade
function mostrarCena(index) {
  imagemEl.style.opacity = 0;
  setTimeout(() => {
    imagemEl.src = cenas[index].imagem;
    imagemEl.style.opacity = 1;
  }, 300);
}

// Mostra a estrofe formatada
function mostrarLetra(texto) {
  const linhas = texto.split('\n');
  letraEl.innerHTML = linhas.map(linha => `<p>${linha}</p>`).join('');
}

function iniciarSincronizacao() {
  const agora = musica.currentTime;

  // Alterna imagem em loop com base no tempo (repetição)
  const cenaIndex = cenas.findIndex((c, i) => {
    const proximaCena = cenas[i + 1];
    return agora >= c.tempo && (!proximaCena || agora < proximaCena.tempo);
  });

  if (cenaIndex !== -1 && cenaIndex !== cenaAtual) {
    cenaAtual = cenaIndex;
    mostrarCena(cenaAtual);
  }

  // Encontra estrofe atual
  const estrofeAtual = letras.find(l => agora >= l.inicio && agora < l.fim);
  if (estrofeAtual) {
    mostrarLetra(estrofeAtual.texto);
  } else {
    letraEl.innerHTML = '';
  }

  timeoutId = setTimeout(iniciarSincronizacao, 200);
}

// Começar
btnComecar.addEventListener('click', () => {
  telaInicial.style.display = 'none';
  conteudo.style.display = 'flex';
  musica.play();
});

// Música
musica.addEventListener('play', () => {
  cenaAtual = 0;
  iniciarSincronizacao();
});
musica.addEventListener('pause', () => clearTimeout(timeoutId));
musica.addEventListener('ended', () => {
  clearTimeout(timeoutId);
  imagemEl.style.opacity = 0;
  letraEl.innerHTML = '';
  cenaAtual = 0;
});

// Cartinha
cartinha.addEventListener('click', () => {
  cartinha.classList.add('pulse');
  setTimeout(() => cartinha.classList.remove('pulse'), 500);
  setTimeout(() => modalCarta.classList.add('show'), 500);
});
btnFecharModal.addEventListener('click', () => modalCarta.classList.remove('show'));
modalCarta.addEventListener('click', (e) => {
  if (e.target === modalCarta) modalCarta.classList.remove('show');
});
