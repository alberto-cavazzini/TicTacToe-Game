const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#statusText');
const restartBtn = document.querySelector('#restartBtn');
const gameWrapper = document.querySelector('#gameWrapper');

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

window.addEventListener('load', () => {
    initializeGame();
    scaleGameWrapper();
});
window.addEventListener('resize', scaleGameWrapper);

function initializeGame(){
  cells.forEach(cell => cell.addEventListener('click', cellClicked));
  restartBtn.addEventListener('click', restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}

function cellClicked(){
  const cellIndex = this.getAttribute('cellIndex');

  if(options[cellIndex] !== '' || !running){
    return;
  }
  updateCell(this, cellIndex);
  checkWinner();
}

function updateCell(cell, index){
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);
}

function changePlayer(){
  currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
  let roundWon = false;

  for(let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if(cellA === '' || cellB === '' || cellC === ''){
      continue;
    }
    if(cellA === cellB && cellB === cellC) {
      roundWon = true;
      break;
    }
  }

  if(roundWon){
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
  }
  else if(!options.includes('')){
    statusText.textContent = `Draw!`;
    running = false;
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
    cell.classList.remove('X', 'O');
  });
  running = true;
}

function scaleGameWrapper() {
    const idealGameWidth = 450;
    const idealGameHeight = 650;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const margin = 40;

    const scaleX = (viewportWidth - margin) / idealGameWidth;
    const scaleY = (viewportHeight - margin) / idealGameHeight;

    let scaleFactor = Math.min(scaleX, scaleY);

    scaleFactor = Math.min(scaleFactor, 1);

    gameWrapper.style.transform = `scale(${scaleFactor})`;
    gameWrapper.style.transformOrigin = 'center center';
}
