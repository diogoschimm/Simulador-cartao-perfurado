let data = [];
let pilha = [];

let cursor = 0;
let posicaoPilha = 0;

function init() { 

  loadMatrizCard();
  renderMatrizCard(); 

  let inputComando = document.querySelector('#comando');
  inputComando.addEventListener('keydown', handleKeyDownTextarea) 
  inputComando.focus();

  window.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();   
    switch (key) {
      case "ARROWDOWN":
        showProximoCartao();
        break;
      case "ARROWUP":
        showCartaoAnterior();
        break; 
      case "ESCAPE":
        reiniciar();
        break;
    } 
  });
  window.addEventListener('click', ()=> {
    inputComando.focus();
  })
}

function reiniciar() {
  loadMatrizCard();
  renderMatrizCard(); 

  pilha = [];
  cursor = 0;
  posicaoPilha = 0;

  const inputComando = document.querySelector('#comando');
  inputComando.value = '';
  inputComando.disabled = false;
  inputComando.focus();

  const divPrograma = document.querySelector("#programa");
  divPrograma.innerHTML = '';
}

function handleKeyDownTextarea(e) {
  const key = e.key.toUpperCase();  
  switch (key) { 
    case "ENTER": 
      carregarNovoCartao();
      break; 
    case "BACKSPACE":
      limpar(e);
      break; 
    default:
      furar(e, key);
      break;
  } 
}

function showProximoCartao() {  

  if (posicaoPilha > pilha.length - 1) return;

  const inputComando = document.querySelector('#comando');
  if (posicaoPilha == pilha.length - 1) {
    posicaoPilha++;
    inputComando.value = ""; 
    inputComando.disabled = false;
    inputComando.focus(); 
    
    loadMatrizCard();
    renderMatrizCard();
    setActiveLiComando();
    
    return;
  }

  posicaoPilha++;
  data = pilha[posicaoPilha];

  inputComando.value = getComando(data, false); 
  inputComando.disabled = true; 

  setActiveLiComando();
  renderMatrizCard();
}

function showCartaoAnterior() { 

  if (posicaoPilha == 0) return;

  posicaoPilha--;
  data = pilha[posicaoPilha];

  const inputComando = document.querySelector('#comando');
  inputComando.value = getComando(data, false); 
  inputComando.disabled = true; 
  
  setActiveLiComando();
  renderMatrizCard();
}

function setActiveLiComando() {
  document.querySelectorAll(`li`).forEach(item => item.classList.remove('active'));

  const liComando = document.querySelector(`li[data-index="${posicaoPilha}"]`);
  if (liComando) {
    liComando.classList.add('active');
  }
}

function carregarNovoCartao() {

  pilha.push([...data]);
  cursor = 0;
  posicaoPilha++;
 
  loadMatrizCard();
  renderMatrizCard();
  
  const inputComando = document.querySelector('#comando');
  inputComando.value = ""; 

  renderizarPrograma();
}

function renderizarPrograma() {
  const divPrograma = document.querySelector("#programa");
  divPrograma.innerHTML = `
    <ul>
      ${pilha.map((item, index) => {
        return `
          <li data-index="${index}">${getComando(item, true)}</li>
        `;  
      }).join('')}
    </ul>
  `;
}

function getComando(item, nbsp) {  
  let comando = '';

  for (let i = 0; i < 80; i++) { 
    const letra = [];

    item.forEach((row) => {
      if (row.columns[i].checked){
        letra.push(1);
      } else {
        letra.push(0);
      }
    })

    comando += getCaractere(letra);    
  }

  return Array.from(comando.trimEnd()).map(char => {
    if ((char == ' ') && nbsp)
      return '&nbsp';

    return char;
  }).join('');
}

function getCaractere(letra) {
  for (const item of mapa) {

    let localizado = true;
    for (let index = 0; index < 12; index++) {
      const element = item[index];

      if (element != letra[index]) {
        localizado = false;
        break;
      }      
    }
    if (localizado) {
      return item[12];
    }
  }

  return "";
}

function limpar() {
  if (cursor > 0) {
    
    cursor--; 
    for (let index = 0; index < data.length; index++) {
      
      const dataRow = data[index];
      const dataColumn = dataRow.columns[cursor];

      dataColumn.checked = false; 
      
      renderPosicaoCartao(dataRow.index, dataColumn.index, dataColumn.checked);     
    }
  }  
}

function furar(e, key) {
 
  const index = mapa.findIndex(arr => arr.includes(key)); 
  if (index < 0 || cursor + 1 > 80) {
    e.preventDefault();
    return;
  }

  if (cursor < 80) {

    const keyValues = mapa[index]; 
    keyValues.forEach((value, index) => {
      if (index < 12) {
        
        const dataRow = data[index];
        const dataColumn = dataRow.columns[cursor];
        dataColumn.checked = Boolean(value);
        
        renderPosicaoCartao(dataRow.index, dataColumn.index, dataColumn.checked);
      }
    }) ;

    cursor++;
  }  
}

function loadMatrizCard() {
  const rows = Array.from({length: 12}).map((_, i) => ++i);
  data = rows.map(posicao => {
    const groupText = posicao >  2 ? 'card' : 'aux';

    const columns = Array.from({length: 80}).map((_, i) => { 
        return { 
            index: ++i, 
            checked: false
        };
    });

    return {
      index: posicao,
      columns,
      groupText 
    }
  })
} 
function renderMatrizCard() {
  divCard = document.querySelector('#cartao');

  divCard.innerHTML = `
    ${data.map(row => {
      return `
        <div class="row ${row.groupText}">
          ${row.columns.map(column => {
            return `
              <div class="column ${column.checked ? 'active' : ''}" data-row="${row.index}" data-column="${column.index}"></div>
            `;
          }).join('')}
        </div>
      `;
    }).join('')}
  `; 
} 
 
function renderPosicaoCartao(row, column, checked) {
  const divColumn = document.querySelector(`.column[data-row="${row}"][data-column="${column}"]`);

  if (checked) {
    divColumn.classList.add('active');
  } else {
    divColumn.classList.remove('active');
  }
} 
  
init();
