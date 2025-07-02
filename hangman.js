const words = ['javascript', 'hangman', 'developer', 'responsive', 'coding', 'canvas'];
let selectedWord = '';
let correctLetters = [];
let wrongLetters = [];

const wordContainer = document.getElementById('word');
const wrongLettersContainer = document.getElementById('wrong-letters');
const restartButton = document.getElementById('restart-btn');
const keyboardContainer = document.getElementById('keyboard');
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
const screamSound = document.getElementById('screamSound');

const resultModal = document.getElementById('resultModal');
const modalMessage = document.getElementById('modal-message');
const playAgainButton = document.getElementById('play-again-btn');

const timerElement = document.getElementById('timer');
let timeLeft = 60;
let timerInterval;

function randomWord() {
  selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
}

function displayWord() {
  wordContainer.innerHTML = selectedWord.split('').map(letter => `
    <span class="${correctLetters.includes(letter) ? 'revealed' : ''}">
      ${correctLetters.includes(letter) ? letter : '_'}
    </span>
  `).join('');

  const innerWord = wordContainer.innerText.replace(/\n/g, '');
  if (innerWord === selectedWord) {
    setTimeout(() => {
      launchConfetti();
      showModal('🎉 You Won!');
    }, 200);
  }
}

function updateWrongLetters() {
  wrongLettersContainer.innerHTML = wrongLetters.join(' ');
  drawHangman();

  if (wrongLetters.length === 6) {
    setTimeout(() => {
      screamSound.play();
      showModal(`💀 You Lost! Word was: ${selectedWord}`);
    }, 200);
  }
}

function drawHangman() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(10, 240);
  ctx.lineTo(190, 240);
  ctx.stroke();

  if (wrongLetters.length > 0) {
    ctx.beginPath();
    ctx.moveTo(50, 240);
    ctx.lineTo(50, 20);
    ctx.lineTo(140, 20);
    ctx.lineTo(140, 50);
    ctx.stroke();
  }
  if (wrongLetters.length > 1) {
    ctx.beginPath();
    ctx.arc(140, 70, 20, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (wrongLetters.length > 2) {
    ctx.beginPath();
    ctx.moveTo(140, 90);
    ctx.lineTo(140, 150);
    ctx.stroke();
  }
  if (wrongLetters.length > 3) {
    ctx.beginPath();
    ctx.moveTo(140, 100);
    ctx.lineTo(110, 130);
    ctx.stroke();
  }
  if (wrongLetters.length > 4) {
    ctx.beginPath();
    ctx.moveTo(140, 100);
    ctx.lineTo(170, 130);
    ctx.stroke();
  }
  if (wrongLetters.length > 5) {
    ctx.beginPath();
    ctx.moveTo(140, 150);
    ctx.lineTo(120, 200);
    ctx.moveTo(140, 150);
    ctx.lineTo(160, 200);
    ctx.stroke();
  }
}

function createKeyboard() {
  keyboardContainer.innerHTML = '';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
    const button = document.createElement('button');
    button.innerText = letter;
    button.addEventListener('click', () => handleGuess(letter, button));
    keyboardContainer.appendChild(button);
  });
}

function handleGuess(letter, button) {
  button.disabled = true;

  if (selectedWord.includes(letter)) {
    correctLetters.push(letter);
    displayWord();
  } else {
    wrongLetters.push(letter);
    updateWrongLetters();
  }
}

function launchConfetti() {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function showModal(message) {
  modalMessage.innerText = message;
  resultModal.style.display = 'flex';
  stopTimer();
}

function closeModal() {
  resultModal.style.display = 'none';
}

function resetGame() {
  correctLetters = [];
  wrongLetters = [];
  randomWord();
  displayWord();
  updateWrongLetters();
  createKeyboard();
  stopTimer();
  startTimer();
}

restartButton.addEventListener('click', () => {
  resetGame();
});

playAgainButton.addEventListener('click', () => {
  resetGame();
  closeModal();
});

function startTimer() {
  timeLeft = 60;
  timerElement.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      screamSound.play();
    
      showModal(`⏰ Time's Up! Word was: ${selectedWord}`);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

randomWord();
displayWord();
createKeyboard();
startTimer();