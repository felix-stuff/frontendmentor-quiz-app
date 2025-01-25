const form = document.getElementById('quiz-form');
const quizCategory = document.getElementById('quiz-category');
const quizTextContainer = document.getElementById('quiz-text-container');
const prefixes = ['A', 'B', 'C', 'D'];
const introText = {
  headline: '<span>Welcome to the</span><strong>Frontend Quiz!</strong>',
  subline: 'Pick a subject to get started.',
};

const appState = {
  quizzes: [],
  currentQuiz: null,
  questionIndex: 0,
  score: 0,
};

const createElement = (tag, content = '', attributes = {}, useInnerText = false) => {
  const element = document.createElement(tag);
  useInnerText ? (element.innerText = content) : (element.innerHTML = content);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));

  return element;
};

const updateTextContainer = (headlineText, sublineText) => {
  headline = createElement('h1', headlineText, { class: 'quiz__headline' });
  subline = createElement('em', sublineText, { class: 'quiz__subline' });
  quizTextContainer.appendChild(headline);
  quizTextContainer.appendChild(subline);
};

updateTextContainer(introText.headline, introText.subline);

const submitButton = createElement('button', 'Submit Answer', {
  class: 'button button--primary',
});

const restartButton = createElement('button', 'Play Again', { class: 'button button--primary' });

const appendQuizSelect = (quiz) => {
  const categoryContent = `<span class='badge badge--${quiz.title}'><img src='${quiz.icon}' alt='' /></span> ${quiz.title}`;

  const categoryLabel = createElement('label', '', {
    for: quiz.title,
    class: 'input--card',
  });

  const categoryInput = createElement('input', '', {
    type: 'radio',
    name: 'category',
    id: `${quiz.title}`,
  });

  const category = createElement('span', categoryContent, { class: 'quiz__category' });

  categoryInput.addEventListener('click', () => selectQuiz(quiz, categoryContent));

  categoryLabel.appendChild(categoryInput);
  categoryLabel.appendChild(category);
  form.appendChild(categoryLabel);
};

const startQuiz = (quiz) => {
  const currentQuestion = quiz.questions[appState.questionIndex];
  const totalQuestions = quiz.questions.length;

  correctAnswer = quiz.questions[appState.questionIndex].answer;

  let questionCounter = createElement(
    'em',
    `Question ${appState.questionIndex + 1} of ${totalQuestions}`,
    { class: 'quiz__subline' }
  );

  let quizProgress = createElement('progress', '', {
    max: totalQuestions,
    value: appState.questionIndex + 1,
    class: 'quiz__progress',
  });

  let question = createElement(
    'p',
    currentQuestion.question,
    { class: 'quiz__question' },
    (useInnerText = true)
  );

  quizTextContainer.innerHTML = '';
  quizTextContainer.className = 'quiz__text-container';
  quizTextContainer.appendChild(questionCounter);
  quizTextContainer.appendChild(question);
  quizTextContainer.appendChild(quizProgress);

  currentQuestion.options.forEach((option, index) => {
    const optionContent = createElement('span', option, {}, (useInnerText = true));

    const optionLabel = createElement(
      'label',
      `<span class="badge badge--neutral">${prefixes[index]}</span>`,
      { for: option, class: 'input input--card' }
    );

    const optionInput = createElement('input', '', {
      type: 'radio',
      name: 'option',
      id: option,
      value: option,
    });

    optionInput.addEventListener('input', () => selectOption(optionInput));

    optionLabel.appendChild(optionInput);
    optionLabel.appendChild(optionContent);
    form.appendChild(optionLabel);
  });

  form.appendChild(submitButton);
};

const handleSubmit = (event) => {
  event.preventDefault(event);
  const formData = new FormData(event.target);
  const selectedAnswer = formData.get('option');

  const currentQuestion = appState.currentQuiz.questions[appState.questionIndex];
  const correctAnswer = currentQuestion.answer;

  checkAnswer(selectedAnswer, correctAnswer);
};

form.addEventListener('submit', handleSubmit);

const restart = () => {
  appState.currentQuiz = null;
  appState.score = 0;
  appState.questionIndex = 0;
  form.innerHTML = '';
  quizTextContainer.innerHTML = '';
  quizTextContainer.classList.add('quiz__start');
  scoreContainer.innerHTML = '';
  updateTextContainer(introText.headline, introText.subline);

  populateDOM(appState.quizzes);
};

restartButton.addEventListener('click', restart);

const selectQuiz = (quiz, category) => {
  appState.currentQuiz = quiz;
  console.log(appState.category);
  appState.questionIndex = 0;
  appState.score = 0;

  quizCategory.innerHTML = category;
  form.innerHTML = '';
  startQuiz(appState.currentQuiz);
};

const checkAnswer = (selectedAnswer, correctAnswer) => {
  const errorMessage = createElement(
    'span',
    '<img src="./assets/images/icon-error.svg" alt="Error Icon" /> Please select an answer',
    { class: 'error', id: 'error-message' }
  );

  if (!selectedAnswer) {
    document.getElementById('error-message') ? '' : form.appendChild(errorMessage);
    return;
  }

  document.getElementById(correctAnswer).parentNode.classList.add('correct');

  if (selectedAnswer === correctAnswer) {
    appState.score++;
  } else {
    document.getElementById(selectedAnswer).parentNode.classList.add('wrong');
  }

  setTimeout(() => {
    nextQuestion(appState.currentQuiz);
  }, '1500');
};

const scoreContainer = createElement('div', '', { class: 'score-container' });

const showScore = () => {
  quizTextContainer.innerHTML = '';
  updateTextContainer('<span>Quiz completed</span><strong>You scored...</strong>');

  const scoreCard = createElement(
    'div',
    `${quizCategory.outerHTML} <span class="quiz__score"><strong>${appState.score}</strong> out of ${appState.currentQuiz.questions.length}</span>`,
    { class: 'card' }
  );

  scoreContainer.appendChild(scoreCard);
  scoreContainer.appendChild(restartButton);
  form.insertAdjacentElement('afterend', scoreContainer);
};

const nextQuestion = (quiz) => {
  appState.questionIndex++;

  form.innerHTML = '';
  quizTextContainer.innerHTML = '';

  if (appState.questionIndex < appState.currentQuiz.questions.length) {
    startQuiz(quiz);
  } else {
    showScore();
  }
};

const populateDOM = (quizzes) => {
  quizzes.forEach((quiz) => {
    appendQuizSelect(quiz);
  });
};

fetch('data.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch quiz data');
    }

    return response.json();
  })
  .then((data) => {
    appState.quizzes = data.quizzes;

    populateDOM(appState.quizzes);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });

const selectOption = (option) => {
  document.querySelectorAll('.selected').forEach((input) => input.classList.remove('selected'));
  option.parentNode.classList.add('selected');
};
