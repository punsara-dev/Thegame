// script.js

const categories = {
  fruits: ['apple', 'banana', 'orange', 'grape', 'melon', 'cherry', 'pineapple', 'kiwi', 'peach', 'plum', 'avocado', 'carambola', 'pomegranate', 'papaya', 'jackfruit', 'melon', 'mulberry'],
  countries: ['usa', 'bangladesh', 'colombia', 'denmark', 'egypt', 'brazil', 'canada', 'japan', 'brazil', 'india', 'sri lanka', 'china', 'australia', 'argentina'],
};

function getRandomWord(category) {
  const words = categories[category];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

function calculateScore(wordLength, remainingAttempts) {
  const score = wordLength * 10 + remainingAttempts * 5;
  saveScoreToFile(score);
  return score;
}

function saveScoreToFile(score) {
  const scoreData = `Score: ${score}`;

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(scoreData));
  element.setAttribute('download', 'score.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  console.log('Score saved successfully!');
}

function startGameWithCategory(category) {
  const selectedWord = getRandomWord(category);
  const wordLength = selectedWord.length;
  let remainingAttempts = 6;
  let guessedLetters = [];
  let displayedWord = '_'.repeat(wordLength);
  let score = 0;

  const wordDisplay = document.querySelector('.word-display');
  const attemptsDisplay = document.querySelector('.attempts-display');
  const guessedLettersDisplay = document.querySelector('.guessed-letters-display');
  const scoreDisplay = document.querySelector('.score-display');
  const guessInput = document.getElementById('guess-input');
  const submitButton = document.getElementById('submit-button');
  const alertMessage = document.getElementById('alert-message');
  const successMessage = document.getElementById('success-message');
  const hangmanImage = document.getElementById('hangman-image');
  const guessForm = document.getElementById('guess-form');
  const wordLengthDisplay = document.querySelector('.word-length-display');

  function updateDisplay() {
    wordDisplay.textContent = 'Guess the word: ' + displayedWord;
    attemptsDisplay.textContent = 'Remaining attempts: ' + remainingAttempts;
    guessedLettersDisplay.textContent = 'Guessed letters: ' + guessedLetters.join(', ');
    scoreDisplay.textContent = 'Current score: ' + score;
    wordLengthDisplay.textContent = 'Word length: ' + wordLength;
  }

  function checkGuess(event) {
    event.preventDefault();

    let guess = guessInput.value.trim().toLowerCase();

    if (guess.length !== 1 || !/[a-z]/.test(guess)) {
      alertMessage.textContent = 'Invalid input. Please enter a single letter.';
      return;
    }

    if (guessedLetters.includes(guess)) {
      alertMessage.textContent = 'You have already guessed that letter. Try another one.';
      return;
    }

    guessedLetters.push(guess);

    if (selectedWord.includes(guess)) {
      let newDisplayedWord = '';
      for (let i = 0; i < wordLength; i++) {
        if (selectedWord[i] === guess) {
          newDisplayedWord += guess;
        } else {
          newDisplayedWord += displayedWord[i];
        }
      }
      displayedWord = newDisplayedWord;

      if (!displayedWord.includes('_')) {
        score = calculateScore(wordLength, remainingAttempts);
        successMessage.textContent = 'Congratulations! You guessed the word: ' + selectedWord;
        successMessage.textContent += '\nYour final score is: ' + score;
        submitButton.disabled = true;
        return;
      }
    } else {
      remainingAttempts--;
      alertMessage.textContent = 'Incorrect guess. Try again.';
      hangmanImage.src = `hangman${6 - remainingAttempts}.png`;
    }

    if (remainingAttempts > 0) {
      updateDisplay();
      guessInput.value = '';
      alertMessage.textContent = '';
    } else {
      score = calculateScore(wordLength, remainingAttempts);
      alertMessage.textContent = 'Game over! You ran out of attempts. The word was: ' + selectedWord;
      alertMessage.textContent += '\nYour final score is: ' + score;
      submitButton.disabled = true;
      return;
    }
  }

  guessForm.addEventListener('submit', checkGuess);
  updateDisplay();
}

function promptCategorySelection() {
  const startButton = document.getElementById('start-button');
  const errorMessage = document.getElementById('error-message');

  startButton.addEventListener('click', () => {
    const categoryInput = document.getElementById('category-input');
    const category = categoryInput.value.toLowerCase();
    if (categories.hasOwnProperty(category)) {
      startGameWithCategory(category);
      errorMessage.textContent = '';
      startButton.disabled = true;
      categoryInput.disabled = true;
      document.getElementById('category-selection').style.display = 'none';
      document.getElementById('game-area').style.display = 'block';
    } else {
      errorMessage.textContent = 'Invalid category. Please select a valid category.';
    }
  });
}

promptCategorySelection();
