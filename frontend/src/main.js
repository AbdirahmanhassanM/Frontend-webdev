import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { config } from './config/config.js'
import { login, signup, logout, getQuestions, submitAnswers, isAuthenticated, getCurrentUser } from './js/api.js'
import { showNotification, toggleElement, showLoading, hideLoading, animateScore, shakeElement, pulseElement } from './js/ui.js'
import { quizQuestions } from './js/quizData.js'
import { addDevModeToggle, getDevModeStatus } from './js/devMode.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

// DOM Elements
const loginBtn = document.getElementById('login-btn')
const signupBtn = document.getElementById('signup-btn')
const loginForm = document.getElementById('login-form')
const signupForm = document.getElementById('signup-form')
const authForms = document.getElementById('auth-forms')
const quizSection = document.getElementById('quiz-section')
const resultsSection = document.getElementById('results-section')
const questionText = document.getElementById('question-text')
const answersContainer = document.getElementById('answers-container')
const currentQuestionSpan = document.getElementById('current-question')
const totalQuestionsSpan = document.getElementById('total-questions')
const scoreDisplay = document.getElementById('score-display')
const feedbackText = document.getElementById('feedback-text')
const retryBtn = document.getElementById('retry-btn')

// State
let currentUser = null
let currentQuestionIndex = 0
let questions = []
let userAnswers = []
let isDevMode = getDevModeStatus() // Get dev mode status from localStorage

// Add development mode toggle if in development
addDevModeToggle()

// Event Listeners
loginBtn.addEventListener('click', () => showAuthForm('login'))
signupBtn.addEventListener('click', () => showAuthForm('signup'))

loginForm.addEventListener('submit', handleLogin)
signupForm.addEventListener('submit', handleSignup)
retryBtn.addEventListener('click', startQuiz)

// Auth Functions
async function handleLogin(e) {
    e.preventDefault()
    const email = loginForm.querySelector('input[type="email"]').value
    const password = loginForm.querySelector('input[type="password"]').value

    try {
        if (isDevMode) {
            // Simulate login in dev mode
            currentUser = { id: 1, username: 'dev_user', email }
            localStorage.setItem('token', 'dev_token')
            localStorage.setItem('user', JSON.stringify(currentUser))
            showNotification('Dev mode login successful!', 'success')
            startQuiz()
        } else {
            const spinner = showLoading(loginForm)
            const data = await login(email, password)
            hideLoading(spinner)
            
            currentUser = data.user
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            
            showNotification('Login successful!', 'success')
            startQuiz()
        }
    } catch (error) {
        showNotification(error.message || 'Login failed. Please check your credentials.', 'error')
    }
}

async function handleSignup(e) {
    e.preventDefault()
    const username = signupForm.querySelector('input[type="text"]').value
    const email = signupForm.querySelector('input[type="email"]').value
    const password = signupForm.querySelector('input[type="password"]').value

    try {
        if (isDevMode) {
            // Simulate signup in dev mode
            showNotification('Dev mode signup successful! Please login.', 'success')
            showAuthForm('login')
        } else {
            const spinner = showLoading(signupForm)
            await signup(username, email, password)
            hideLoading(spinner)
            
            showNotification('Signup successful! Please login.', 'success')
            showAuthForm('login')
        }
    } catch (error) {
        showNotification(error.message || 'Signup failed. Please try again.', 'error')
    }
}

function showAuthForm(formType) {
    toggleElement(authForms, true)
    toggleElement(loginForm, formType === 'login')
    toggleElement(signupForm, formType === 'signup')
    toggleElement(quizSection, false)
    toggleElement(resultsSection, false)
}

// Quiz Functions
async function startQuiz() {
    try {
        let spinner
        
        if (isDevMode) {
            // Use local quiz data for development
            questions = quizQuestions
            currentQuestionIndex = 0
            userAnswers = []
            showQuestion()
        } else {
            // Use API for production
            spinner = showLoading(quizSection)
            questions = await getQuestions()
            hideLoading(spinner)
            
            currentQuestionIndex = 0
            userAnswers = []
            showQuestion()
        }
    } catch (error) {
        showNotification(error.message || 'Failed to load questions.', 'error')
    }
}

function showQuestion() {
    toggleElement(authForms, false)
    toggleElement(quizSection, true)
    toggleElement(resultsSection, false)

    const question = questions[currentQuestionIndex]
    questionText.textContent = question.text
    currentQuestionSpan.textContent = currentQuestionIndex + 1
    totalQuestionsSpan.textContent = questions.length

    answersContainer.innerHTML = ''

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button')
        button.className = 'answer-btn'
        button.textContent = answer
        button.addEventListener('click', () => handleAnswer(index))
        answersContainer.appendChild(button)
    })
    
    // Add animation
    questionText.classList.add('slide-in')
    setTimeout(() => {
        questionText.classList.remove('slide-in')
    }, 500)
}

async function handleAnswer(answerIndex) {
    const answerButtons = answersContainer.querySelectorAll('.answer-btn')
    const selectedButton = answerButtons[answerIndex]
    
    // Disable all buttons to prevent multiple selections
    answerButtons.forEach(btn => btn.disabled = true)
    
    // Add visual feedback
    if (isDevMode) {
        // In dev mode, we know the correct answer
        const correctIndex = questions[currentQuestionIndex].correctAnswer
        
        if (answerIndex === correctIndex) {
            selectedButton.classList.add('correct')
            pulseElement(selectedButton)
        } else {
            selectedButton.classList.add('incorrect')
            shakeElement(selectedButton)
            answerButtons[correctIndex].classList.add('correct')
        }
    } else {
        // In production, just highlight the selected answer
        selectedButton.classList.add('pulse')
    }
    
    userAnswers.push(answerIndex)

    // Wait a moment before moving to the next question
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++
            showQuestion()
        } else {
            submitQuiz()
        }
    }, isDevMode ? 1000 : 300)
}

async function submitQuiz() {
    try {
        const spinner = showLoading(quizSection)
        
        if (isDevMode) {
            // Calculate score locally for development
            hideLoading(spinner)
            const score = calculateScore()
            showResults({ score })
        } else {
            // Submit to API for production
            const results = await submitAnswers(userAnswers)
            hideLoading(spinner)
            showResults(results)
        }
    } catch (error) {
        showNotification(error.message || 'Failed to submit answers.', 'error')
    }
}

function calculateScore() {
    let correctCount = 0
    
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correctAnswer) {
            correctCount++
        }
    })
    
    return Math.round((correctCount / questions.length) * 100)
}

function showResults(results) {
    toggleElement(quizSection, false)
    toggleElement(resultsSection, true)
    
    // Animate the score counter
    animateScore(scoreDisplay, 0, results.score)
    
    // Set feedback text
    feedbackText.textContent = getFeedbackText(results.score)
}

function getFeedbackText(score) {
    if (score >= 80) return "Wow! You're actually pretty smart! 🧠"
    if (score >= 60) return "Not bad! You're smarter than you look! 😉"
    if (score >= 40) return "Well... at least you tried! 🤔"
    return "Maybe you should stick to watching cat videos... 😅"
}

// Check for existing session
if (isAuthenticated() || isDevMode) {
    currentUser = getCurrentUser()
    startQuiz()
} else {
    showAuthForm('login')
}
