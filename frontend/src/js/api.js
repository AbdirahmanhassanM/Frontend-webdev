import { config } from '../config/config.js';

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
}

// Authentication functions
export async function login(email, password) {
  const response = await fetch(`${config.API_URL}${config.ENDPOINTS.AUTH.SIGNIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  return handleResponse(response);
}

export async function signup(username, email, password) {
  const response = await fetch(`${config.API_URL}${config.ENDPOINTS.AUTH.SIGNUP}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  
  return handleResponse(response);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Quiz functions
export async function getQuestions() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  
  const response = await fetch(`${config.API_URL}${config.ENDPOINTS.QUIZ.GET_QUESTIONS}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return handleResponse(response);
}

export async function submitAnswers(answers) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  
  const response = await fetch(`${config.API_URL}${config.ENDPOINTS.QUIZ.SUBMIT_ANSWER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });
  
  return handleResponse(response);
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Get current user
export function getCurrentUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
} 