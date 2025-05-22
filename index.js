const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#statusText');
const restartBtn = document.querySelector('#restartBtn');
const gameWrapper = document.querySelector('#gameWrapper'); // Seleziona il nuovo wrapper

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let options = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let running = false;

// Inizializza il gioco e applica la scala all'avvio
window.addEventListener('load', () => {
    initializeGame();
    scaleGameWrapper();
});
window.addEventListener('resize', scaleGameWrapper); // Per ridimensionare al cambiare della finestra

function initializeGame(){
  cells.forEach(cell => cell.addEventListener('click', cellClicked));
  restartBtn.addEventListener('click', restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}

function cellClicked(){
  const cellIndex = this.getAttribute('cellIndex');

  if(options[cellIndex] !== '' || !running){ // Usato !== per confronto rigoroso
    return;
  }
  updateCell(this, cellIndex);
  checkWinner();
}

function updateCell(cell, index){
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
  // Aggiungiamo la classe per X o O per lo styling CSS
  cell.classList.add(currentPlayer);
}

function changePlayer(){
  currentPlayer = (currentPlayer === 'X') ? 'O' : 'X'; // Usato === per confronto rigoroso
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
  let roundWon = false;

  for(let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if(cellA === '' || cellB === '' || cellC === ''){ // Usato ===
      continue;
    }
    if(cellA === cellB && cellB === cellC) { // Usato ===
      roundWon = true;
      break;
    }
  }

  if(roundWon){ // roundWon è già un booleano
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
  }
  else if(!options.includes('')){
    statusText.textContent = `Draw!`;
    running = false; // Il gioco finisce anche in caso di pareggio
  }
  else{
    changePlayer();
  }
}

function restartGame(){
  currentPlayer = 'X';
  options = ['', '', '', '', '', '', '', '', ''];
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    // Rimuoviamo le classi X o O quando resettiamo
    cell.classList.remove('X', 'O');
  });
  running = true;
}

/**
 * Scala l'intero wrapper del gioco per adattarlo alle dimensioni della finestra del browser.
 * Si assicura che il gioco non superi mai la sua dimensione "ideale" (100% di zoom)
 * e che rimanga sempre visibile per intero.
 */
function scaleGameWrapper() {
    // Definisci la dimensione "ideale" (non scalata) del tuo gameWrapper.
    // Questi valori DEVONO corrispondere circa alla dimensione massima che il tuo gioco dovrebbe avere
    // prima che la scala diventi 1 (cioè, il 100% di zoom ideale).
    // Puoi trovarli ispezionando l'elemento #gameWrapper nel browser su una finestra grande.
    const idealGameWidth = 450;  // Larghezza stimata (es. contenitore celle + padding)
    const idealGameHeight = 650; // Altezza stimata (es. titolo + contenitore celle + stato + bottone + padding)

    const viewportWidth = window.innerWidth;  // Larghezza corrente della finestra
    const viewportHeight = window.innerHeight; // Altezza corrente della finestra

    const margin = 40; // Un margine di sicurezza (es. 20px per lato) per non "incollare" il gioco ai bordi

    // Calcola il fattore di scala necessario per adattarsi alla larghezza disponibile
    const scaleX = (viewportWidth - margin) / idealGameWidth;
    // Calcola il fattore di scala necessario per adattarsi all'altezza disponibile
    const scaleY = (viewportHeight - margin) / idealGameHeight;

    // Scegli il fattore di scala più piccolo tra i due per assicurarti che l'intero gioco si adatti,
    // sia in larghezza che in altezza.
    let scaleFactor = Math.min(scaleX, scaleY);

    // IMPEDISCI CHE IL GIOCO SI INGRANDISCA OLTRE LA SUA DIMENSIONE ORIGINALE (ZOOM 100%)
    // Se il fattore di scala calcolato è maggiore di 1, impostalo a 1.
    // Questo assicura che il gioco non diventi mai più grande della sua dimensione "ideale".
    scaleFactor = Math.min(scaleFactor, 1); 

    // Applica la trasformazione di scala al wrapper del gioco
    gameWrapper.style.transform = `scale(${scaleFactor})`;
    // Imposta il punto di origine della trasformazione al centro, per mantenere il gioco centrato
    gameWrapper.style.transformOrigin = 'center center'; 
}
