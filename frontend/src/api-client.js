// API Client for Are You Dumb Quiz Application

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Something went wrong');
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  // Register a new user
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Failed to sign up. Please try again.');
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to log in. Please check your credentials.');
    }
  },
};

// Quiz API
export const quizAPI = {
  // Get all quizzes
  getAllQuizzes: async (token) => {
    try {
      const response = await fetch(`${API_URL}/quiz`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get quizzes error:', error);
      throw new Error('Failed to load quizzes. Please try again later.');
    }
  },

  // Get quiz by ID
  getQuizById: async (quizId, token) => {
    try {
      const response = await fetch(`${API_URL}/quiz/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get quiz error:', error);
      throw new Error('Failed to load quiz. Please try again later.');
    }
  },

  // Submit quiz answer
  submitAnswer: async (quizId, answer, token) => {
    try {
      const response = await fetch(`${API_URL}/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ answer }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Submit answer error:', error);
      throw new Error('Failed to submit answer. Please try again.');
    }
  },

  // Create new quiz (admin only)
  createQuiz: async (quizData, token) => {
    try {
      const response = await fetch(`${API_URL}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create quiz error:', error);
      throw new Error('Failed to create quiz. Please try again later.');
    }
  },
}; 