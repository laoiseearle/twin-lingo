let previousCard, selectedCard;
let clickCounter = 0;
let currentlyFlipping = false;
const wordSet = [verbs, colors, animals, emotions];
const cards = document.getElementsByClassName('card');
const cardsBack = document.getElementsByClassName('card-back');
const randomWordFromArray = arr => Math.floor(Math.random() * arr.length);
const everyCardCorrect = arr => arr.every(element => element.classList.contains('correct'));
const getWordSet = () => document.querySelector('input[name="words"]:checked').value;

const correctGuess = (prev, current) => {
  current.children[1].classList.toggle('correct');
  prev.children[1].classList.toggle('correct');
  currentlyFlipping = false;

  if (everyCardCorrect(Array.from(cardsBack))) {
    // Shows last card before starting new game
    setTimeout(function () {
      start();
    }, 800);
  }
};

const incorrectGuess = (prev, current) => {
  // Shows cards before flipping them
  setTimeout(function () {
    currentlyFlipping = false;
    prev.classList.remove('flip-card');
    current.classList.remove('flip-card');
    current.addEventListener('click', cardClick);
    prev.addEventListener('click', cardClick);
  }, 800);
};

const cardGuess = (prev, current) => {
  let arr = wordSet[getWordSet()];

  if (
    arr.includes(prev.innerText + ' : ' + current.innerText) ||
    arr.includes(current.innerText + ' : ' + prev.innerText)
  ) {
    correctGuess(prev, current);
  } else {
    incorrectGuess(prev, current);
  }
};

const cardClick = e => {
  // Prevents click while card is flipping
  if (currentlyFlipping) {
    return;
  }
  currentlyFlipping = true;
  clickCounter++;
  selectedCard = e.currentTarget;
  selectedCard.classList.add('flip-card');
  selectedCard.removeEventListener('click', cardClick);

  if (clickCounter % 2 === 0) {
    cardGuess(previousCard, selectedCard);
  } else {
    currentlyFlipping = false;
  }
  previousCard = selectedCard;
};

// Shuffles array and assigns each word to a card
const setUpCards = arr => {
  arr.sort(() => Math.random() - 0.5);
  arr.forEach((word, i) => {
    cards[i].addEventListener('click', cardClick);
    cards[i].children[1].innerText = word;
  });
};

// Selects 12 random words from wordset and pushes them into a new array
const createArray = arr => {
  let selectedWords = [];

  while (selectedWords.length !== 12) {
    let randomWord = randomWordFromArray(arr);
    let newWord = arr[randomWord].split(' : ');

    if (!selectedWords.includes(newWord[0])) {
      selectedWords.push(newWord[0], newWord[1]);
    }
  }
  setUpCards(selectedWords);
};

const resetGame = () => {
  [].forEach.call(cards, card => {
    card.classList.remove('flip-card');
    card.children[1].classList.remove('correct');
  });
  currentlyFlipping = false;
  clickCounter = 0;
};

const start = () => {
  resetGame();
  // Prevents words from showing before flip animation finishes
  setTimeout(function () {
    createArray(wordSet[getWordSet()]);
  }, 600);
};
start();
