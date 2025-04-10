<template>
  <div class="api-service">
    <!-- This is a service component, so it doesn't need a template -->
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default {
  name: 'ApiService',
  data() {
    return {
      API_URL,
      token: localStorage.getItem('token')
    };
  },
  methods: {
    // Helper function to handle API responses
    async handleResponse(response) {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      return response.json();
    },

    // Authentication API
    async signup(userData) {
      try {
        const response = await fetch(`${this.API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        return this.handleResponse(response);
      } catch (error) {
        console.error('Signup error:', error);
        throw new Error('Failed to sign up. Please try again.');
      }
    },

    async login(credentials) {
      try {
        const response = await fetch(`${this.API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        const data = await this.handleResponse(response);
        this.token = data.token;
        localStorage.setItem('token', this.token);
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw new Error('Failed to log in. Please check your credentials.');
      }
    },

    // Quiz API
    async getAllQuizzes() {
      try {
        const response = await fetch(`${this.API_URL}/quiz`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        return this.handleResponse(response);
      } catch (error) {
        console.error('Get quizzes error:', error);
        throw new Error('Failed to load quizzes. Please try again later.');
      }
    },

    async getQuizById(quizId) {
      try {
        const response = await fetch(`${this.API_URL}/quiz/${quizId}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        return this.handleResponse(response);
      } catch (error) {
        console.error('Get quiz error:', error);
        throw new Error('Failed to load quiz. Please try again later.');
      }
    },

    async submitAnswer(quizId, answer) {
      try {
        const response = await fetch(`${this.API_URL}/quiz/${quizId}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
          body: JSON.stringify({ answer }),
        });
        return this.handleResponse(response);
      } catch (error) {
        console.error('Submit answer error:', error);
        throw new Error('Failed to submit answer. Please try again.');
      }
    },

    async createQuiz(quizData) {
      try {
        const response = await fetch(`${this.API_URL}/quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
          body: JSON.stringify(quizData),
        });
        return this.handleResponse(response);
      } catch (error) {
        console.error('Create quiz error:', error);
        throw new Error('Failed to create quiz. Please try again later.');
      }
    },

    // Token management
    getToken() {
      return this.token;
    },

    setToken(newToken) {
      this.token = newToken;
      localStorage.setItem('token', this.token);
    },

    clearToken() {
      this.token = null;
      localStorage.removeItem('token');
    }
  },
  created() {
    // Initialize token from localStorage
    this.token = localStorage.getItem('token');
  }
};
</script>

<style scoped>
/* This is a service component, so it doesn't need styles */
</style> 