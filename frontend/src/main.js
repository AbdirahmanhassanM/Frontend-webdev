import { authAPI, quizAPI } from './api-client';
import './test-connection';

// Simple quiz application using vanilla JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const loginForm = document.getElementById('login-form').querySelector('form');
  const signupForm = document.getElementById('signup-form').querySelector('form');
  const authForms = document.getElementById('auth-forms');
  const quizSection = document.getElementById('quiz-section');
  const resultsSection = document.getElementById('results-section');
  const questionText = document.getElementById('question-text');
  const answersContainer = document.getElementById('answers-container');
  const currentQuestionSpan = document.getElementById('current-question');
  const totalQuestionsSpan = document.getElementById('total-questions');
  const scoreDisplay = document.getElementById('score-display');
  const feedbackText = document.getElementById('feedback-text');
  const retryBtn = document.getElementById('retry-btn');

  // State
  let currentQuiz = null;
  let currentQuestionIndex = 0;
  let score = 0;
  let token = localStorage.getItem('token');

  // Event Listeners
  loginBtn.addEventListener('click', () => {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
  });

  signupBtn.addEventListener('click', () => {
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
  });

  loginForm.addEventListener('submit', handleLogin);
  signupForm.addEventListener('submit', handleSignup);
  retryBtn.addEventListener('click', startQuiz);

  // Check if user is already logged in
  if (token) {
    authForms.classList.add('hidden');
    startQuiz();
  }

  // Authentication Functions
  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
      const response = await authAPI.login({ email, password });
      token = response.token;
      localStorage.setItem('token', token);
      authForms.classList.add('hidden');
      startQuiz();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const username = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
      const response = await authAPI.signup({ username, email, password });
      token = response.token;
      localStorage.setItem('token', token);
      authForms.classList.add('hidden');
      startQuiz();
    } catch (error) {
      alert(error.message);
    }
  }

  // Quiz Functions
  async function startQuiz() {
    try {
      const quizzes = await quizAPI.getAllQuizzes(token);
      currentQuiz = quizzes[0]; // Get the first quiz for now
      currentQuestionIndex = 0;
      score = 0;
      quizSection.classList.remove('hidden');
      resultsSection.classList.add('hidden');
      showQuestion();
    } catch (error) {
      alert('Failed to load quiz: ' + error.message);
    }
  }

  function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    questionText.textContent = question.text;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    totalQuestionsSpan.textContent = currentQuiz.questions.length;

    answersContainer.innerHTML = '';
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.className = 'answer-btn';
      button.textContent = answer;
      button.addEventListener('click', () => handleAnswer(index));
      answersContainer.appendChild(button);
    });
  }

  async function handleAnswer(answerIndex) {
    try {
      const response = await quizAPI.submitAnswer(currentQuiz.id, answerIndex, token);
      const isCorrect = response.isCorrect;
      
      const buttons = answersContainer.querySelectorAll('.answer-btn');
      buttons.forEach(button => button.disabled = true);
      
      if (isCorrect) {
        buttons[answerIndex].classList.add('correct');
        score++;
      } else {
        buttons[answerIndex].classList.add('incorrect');
        buttons[response.correctAnswerIndex].classList.add('correct');
      }

      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuiz.questions.length) {
          showQuestion();
        } else {
          showResults();
        }
      }, 1000);
    } catch (error) {
      alert('Failed to submit answer: ' + error.message);
    }
  }

  function showResults() {
    quizSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    const percentage = (score / currentQuiz.questions.length) * 100;
    scoreDisplay.textContent = `${percentage}%`;
    
    let feedback;
    if (percentage >= 80) {
      feedback = "Congratulations! You're not dumb at all! 🎉";
    } else if (percentage >= 60) {
      feedback = "Not bad! You're smarter than you think! 😊";
    } else if (percentage >= 40) {
      feedback = "Well... at least you tried! 🤔";
    } else {
      feedback = "Maybe you should study a bit more... 📚";
    }
    
    feedbackText.textContent = feedback;
  }
});
